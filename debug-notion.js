#!/usr/bin/env node

require('dotenv').config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const testPageIds = [
    '208cb99eb16c8038a74bf1eeda21cf62', // Test 1 (extracted from URL)
    '16ecb99eb16c8078ae75f18da11fdb20', // Jam Band new year 2024 (extracted)
    '16ccb99eb16c804fb177fceadfd34f67', // Drones (extracted)
    '16ccb99eb16c8010937defd3fa6fe99d'  // Billy and the kids (extracted)
];

async function debugNotionAPI() {
    console.log('🔍 Debugging Notion API...');
    console.log('API Key exists:', !!NOTION_API_KEY);
    console.log('Testing', testPageIds.length, 'pages...');
    
    for (let i = 0; i < testPageIds.length; i++) {
        const testPageId = testPageIds[i];
        console.log(`\n=== Testing Page ${i + 1} (${testPageId}) ===`);
    
    try {
        // Test 1: Get page info
        console.log('\n📄 Testing page info...');
        const pageResponse = await fetch(`https://api.notion.com/v1/pages/${testPageId}`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28'
            }
        });
        
        if (pageResponse.ok) {
            const pageData = await pageResponse.json();
            console.log('✅ Page info retrieved successfully');
            console.log('Page title:', pageData.properties?.Title?.title?.[0]?.plain_text);
            console.log('Page object:', pageData.object);
            console.log('Page parent:', pageData.parent);
        } else {
            console.log('❌ Page info failed:', pageResponse.status, pageResponse.statusText);
        }
        
        // Test 2: Get page blocks
        console.log('\n🧱 Testing page blocks...');
        const blocksResponse = await fetch(`https://api.notion.com/v1/blocks/${testPageId}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28'
            }
        });
        
        if (blocksResponse.ok) {
            const blocksData = await blocksResponse.json();
            console.log('✅ Blocks retrieved successfully');
            console.log('Number of blocks:', blocksData.results.length);
            console.log('Has more:', blocksData.has_more);
            console.log('Next cursor:', blocksData.next_cursor);
            
            if (blocksData.results.length > 0) {
                console.log('\n📝 First few blocks:');
                blocksData.results.slice(0, 3).forEach((block, i) => {
                    console.log(`Block ${i + 1}:`, block.type, block[block.type]);
                });
            } else {
                console.log('⚠️ No blocks found - page might be empty');
            }
        } else {
            console.log('❌ Blocks failed:', blocksResponse.status, blocksResponse.statusText);
            const errorText = await blocksResponse.text();
            console.log('Error details:', errorText);
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
    }
}

debugNotionAPI();
