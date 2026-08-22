// Edge middleware for jimi.land.
// Serves static assets as before, plus two analytics duties for Pulse:
//   1. POST /_pulse/e — same-origin beacon proxy (keeps CSP at connect-src 'self')
//   2. Logs every served HTML document server-side — the only way to see
//      AI crawlers (GPTBot, ClaudeBot, ...), which never execute JS.
// Human counting stays JS-beacon-only; edge rows with no bot UA are ignored
// by Pulse rollups, so the double fire per human view is by design.
//
// Kept in sync with docs/edge-middleware.md's "Cloudflare Worker-with-assets
// variant" in the Pulse repo — that doc is the source of truth for this file.

const PULSE_INGEST = 'https://pulse/api/event';

function forward(env, request, body) {
  return env.PULSE.fetch(PULSE_INGEST, {
    method: 'POST',
    body,
    headers: {
      'x-pulse-key': env.EDGE_SECRET,
      'x-pulse-ua': request.headers.get('user-agent') || '',
      'x-pulse-ip': request.headers.get('cf-connecting-ip') || '',
      // Network identity for unrecognised crawlers (docs/crawler-purposes.md).
      // request.cf is Cloudflare-specific but always populated here — this is
      // a genuine Cloudflare Worker fetch handler.
      'x-pulse-asn': request.cf?.asn != null ? String(request.cf.asn) : '',
      'x-pulse-as-org': request.cf?.asOrganization || '',
      // Web Bot Auth (RFC 9421) signature headers, forwarded as-is — harmless
      // to send even for a request with none of them; only read by ingest on
      // this same trusted-edge path (docs/crawler-purposes.md's "Signed requests").
      'x-pulse-sig-signature': request.headers.get('signature') || '',
      'x-pulse-sig-signature-input': request.headers.get('signature-input') || '',
      'x-pulse-sig-signature-agent': request.headers.get('signature-agent') || '',
      'x-pulse-sig-authority': request.headers.get('host') || '',
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

    const assetRes = await env.ASSETS.fetch(request);
    // Clone so the diagnostic header below can be attached even if the
    // asset response's headers are immutable.
    const res = new Response(assetRes.body, assetRes);

    // x-pulse-edge exists because the try/catch pattern elsewhere (correctly)
    // hides any capture failure from the page — this header is the only way
    // to see "not running" vs "running but misconfigured" from the outside:
    //   curl -sD - -o /dev/null https://jimi.land/ | grep x-pulse-edge
    res.headers.set('x-pulse-edge', env.EDGE_SECRET ? 'sending' : 'no-secret');

    // Deliberately NO `res.status === 200` gate: a 401/402/403/429 (blocked)
    // or 5xx (failed) response is exactly what served-vs-blocked reporting
    // exists to distinguish from a real 200 (migrations/0011_response_status.sql)
    // — filtering it out here would just recreate the same overclaim with a
    // different mechanism. The content-type check is what actually keeps
    // this from double-logging assets and API routes.
    if (
      request.method === 'GET' &&
      (res.headers.get('content-type') || '').includes('text/html')
    ) {
      // status/cache_status are captured from the REAL response, after
      // env.ASSETS.fetch() resolved — what actually happened, not a guess.
      // Trusted ONLY on this same authenticated edge path; ingest never
      // reads these fields from a public JS beacon.
      const hit = JSON.stringify({
        sid: 'jimiland',
        e: 'pageview',
        path: url.pathname,
        ref: request.headers.get('referer') || undefined,
        src: 'edge',
        status: res.status,
        cache_status: res.headers.get('cf-cache-status') || undefined,
      });
      ctx.waitUntil(forward(env, request, hit).catch(() => {}));
    }

    return res;
  },
};
