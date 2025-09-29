exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    console.log('🤖 Netlify Function - Cloudiator API call received');
    console.log('📥 Request Method:', event.httpMethod);
    console.log('📥 Request Headers:', event.headers);
    console.log('📥 Request Body:', event.body);

    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      console.log('❌ Missing prompt in request body');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyByyPyLqSCevZhWA4z21gdL7wxLtCYe-Fg';
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

    console.log('📤 Sending request to Gemini API');
    console.log('📤 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    console.log('📤 Model:', model);
    console.log('📤 Prompt length:', prompt.length);

    const geminiPayload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
        topP: 0.8,
        topK: 10,
      },
    };

    console.log('📤 Gemini Payload:', JSON.stringify(geminiPayload, null, 2));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify(geminiPayload),
      }
    );

    console.log('📥 Gemini Response Status:', response.status);
    console.log('📥 Gemini Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📥 Gemini Response Data:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('❌ Invalid Gemini Response Structure:', data);
      throw new Error('Invalid response from Gemini API - missing candidates or content');
    }

    const botResponse = data.candidates[0].content.parts[0].text;
    console.log('✅ Extracted Bot Response:', botResponse);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response: botResponse }),
    };

  } catch (error) {
    console.error('❌ Netlify Function Cloudiator API error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Full Error Object:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: `I apologize, but I'm experiencing technical difficulties. Error: ${error.message}. Please try again in a moment or contact our team directly at arezk@cloudastick.com.` 
      }),
    };
  }
};
