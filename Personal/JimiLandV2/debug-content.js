#!/usr/bin/env node

require('dotenv').config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;

async function debugContentRetrieval() {
    console.log('🔍 Debugging content retrieval...');
    
    // Test with the first post from our database
    const testUrl = 'https://www.notion.so/Test-1-208cb99eb16c8038a74bf1eeda21cf62';
    const pageId = '208cb99eb16c8038a74bf1eeda21cf62';
    
    console.log('Test URL:', testUrl);
    console.log('Page ID:', pageId);
    
    try {
        // Method 1: Try with dashes in ID
        console.log('\n=== Method 1: ID with dashes ===');
        const dashedId = pageId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
        console.log('Dashed ID:', dashedId);
        
        const response1 = await fetch(`https://api.notion.com/v1/blocks/${dashedId}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28'
            }
        });
        
        if (response1.ok) {
            const data1 = await response1.json();
            console.log('✅ Success with dashed ID');
            console.log('Blocks found:', data1.results.length);
            if (data1.results.length > 0) {
                console.log('First block type:', data1.results[0].type);
                console.log('First block content:', JSON.stringify(data1.results[0], null, 2));
            }
        } else {
            console.log('❌ Failed with dashed ID:', response1.status);
        }
        
        // Method 2: Try without dashes
        console.log('\n=== Method 2: ID without dashes ===');
        const response2 = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28'
            }
        });
        
        if (response2.ok) {
            const data2 = await response2.json();
            console.log('✅ Success without dashes');
            console.log('Blocks found:', data2.results.length);
            if (data2.results.length > 0) {
                console.log('First block type:', data2.results[0].type);
                console.log('First block content:', JSON.stringify(data2.results[0], null, 2));
            }
        } else {
            console.log('❌ Failed without dashes:', response2.status);
        }
        
        // Method 3: Try to get page properties to see if there's a different content field
        console.log('\n=== Method 3: Page properties ===');
        const response3 = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28'
            }
        });
        
        if (response3.ok) {
            const data3 = await response3.json();
            console.log('✅ Page properties retrieved');
            console.log('Properties:', Object.keys(data3.properties));
            
            // Check if there's content in properties
            for (const [key, value] of Object.entries(data3.properties)) {
                if (value.rich_text && value.rich_text.length > 0) {
                    console.log(`Found rich text in ${key}:`, value.rich_text[0].plain_text);
                }
            }
        } else {
            console.log('❌ Failed to get page properties:', response3.status);
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }
}

debugContentRetrieval();
