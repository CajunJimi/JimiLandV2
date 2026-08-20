// Edge middleware for jimi.land.
// Serves static assets as before, plus two analytics duties for Pulse:
//   1. POST /_pulse/e — same-origin beacon proxy (keeps CSP at connect-src 'self')
//   2. Logs every served HTML document server-side — the only way to see
//      AI crawlers (GPTBot, ClaudeBot, ...), which never execute JS.
// Human counting stays JS-beacon-only; edge rows with no bot UA are ignored
// by Pulse rollups, so the double fire per human view is by design.

const PULSE_INGEST = 'https://pulse/api/event';

function forward(env, request, body) {
  return env.PULSE.fetch(PULSE_INGEST, {
    method: 'POST',
    body,
    headers: {
      'x-pulse-key': env.EDGE_SECRET,
      'x-pulse-ua': request.headers.get('user-agent') || '',
      'x-pulse-ip': request.headers.get('cf-connecting-ip') || '',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/_pulse/e') {
      const body = await request.text();
      ctx.waitUntil(forward(env, request, body).catch(() => {}));
      return new Response(null, { status: 202 });
    }

    const res = await env.ASSETS.fetch(request);

    if (
      request.method === 'GET' &&
      res.status === 200 &&
      (res.headers.get('content-type') || '').includes('text/html')
    ) {
      const hit = JSON.stringify({
        sid: 'jimiland',
        e: 'pageview',
        path: url.pathname,
        ref: request.headers.get('referer') || undefined,
        src: 'edge',
      });
      ctx.waitUntil(forward(env, request, hit).catch(() => {}));
    }

    return res;
  },
};
