import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { emailText } = await request.json();
    
    console.log('📧 Received email, length:', emailText?.length);
    
    if (!emailText || emailText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email text is required' },
        { status: 400 }
      );
    }

    // Call n8n workflow
    const n8nUrl = `${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/email-classifier`;
    console.log('🔗 Calling n8n:', n8nUrl);
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailText }),
    });

    console.log('✅ n8n status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ n8n error:', errorText);
      throw new Error(`n8n returned ${response.status}`);
    }

    const responseText = await response.text();
    console.log('📄 Response length:', responseText.length);
    
    if (!responseText || responseText.trim().length === 0) {
      throw new Error('Empty response from n8n');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Parse error:', parseError);
      throw new Error('Invalid JSON response from n8n');
    }

    console.log('📦 Success:', data.success);
    
    return NextResponse.json(data);
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
