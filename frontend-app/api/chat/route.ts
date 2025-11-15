import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    console.log('📨 Received message:', message);
    
    const n8nUrl = `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/ai-test`;
    console.log('🔗 Calling n8n:', n8nUrl);
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    console.log('✅ n8n status:', response.status);

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}`);
    }

    // Get text first to handle empty responses
    const responseText = await response.text();
    console.log('📄 Response length:', responseText.length);
    console.log('📄 Response preview:', responseText.substring(0, 200));

    if (!responseText || responseText.trim().length === 0) {
      console.error('❌ Empty response from n8n!');
      throw new Error('n8n returned empty response');
    }

    // Parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📦 Parsed data:', data);
    } catch (parseError) {
      console.error('❌ JSON parse failed:', parseError);
      // If not JSON, return as text
      data = { response: responseText };
    }
    
    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('💥 Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
