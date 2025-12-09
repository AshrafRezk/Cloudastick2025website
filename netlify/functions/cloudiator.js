// Helper function to check if error is quota-related
const isQuotaError = (statusCode, errorData) => {
  if (statusCode === 429) return true;
  if (errorData && typeof errorData === 'object') {
    const errorStr = JSON.stringify(errorData).toLowerCase();
    return errorStr.includes('quota') || 
           errorStr.includes('resource_exhausted') ||
           errorStr.includes('rate limit');
  }
  return false;
};

// Helper function to extract retry information from error
const extractRetryInfo = (errorData) => {
  let retryAfter = null;
  if (errorData && typeof errorData === 'object') {
    const errorStr = JSON.stringify(errorData);
    const retryMatch = errorStr.match(/retry.*?(\d+).*?minute/i);
    if (retryMatch) {
      retryAfter = retryMatch[1];
    }
  }
  return retryAfter;
};

// Helper function to call Gemini API with a specific model
const callGeminiAPI = async (apiKey, model, prompt) => {
  const geminiPayload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 512,
      topP: 0.8,
      topK: 10,
    },
  };

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

  const errorText = !response.ok ? await response.text() : null;
  return { response, errorText };
};

// Helper function to try multiple models with fallback
const tryGeminiWithFallback = async (apiKey, prompt, models) => {
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    console.log(`🔄 Attempting with model: ${model} (${i + 1}/${models.length})`);
    
    try {
      const { response, errorText } = await callGeminiAPI(apiKey, model, prompt);
      
      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          console.log(`✅ Success with model: ${model}`);
          return { success: true, data };
        }
      } else {
        // Check if it's a quota error
        let errorData = null;
        try {
          errorData = errorText ? JSON.parse(errorText) : null;
        } catch (e) {
          // Not JSON, continue
        }
        
        if (isQuotaError(response.status, errorData)) {
          console.log(`⚠️ Quota exceeded for model: ${model}`);
          // If this is not the last model, try the next one
          if (i < models.length - 1) {
            console.log(`🔄 Trying fallback model...`);
            continue;
          }
          // Last model, return quota error
          return { 
            success: false, 
            quotaError: true, 
            statusCode: response.status,
            errorData 
          };
        } else {
          // Non-quota error, throw it
          throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }
      }
    } catch (error) {
      // Network or parsing error
      if (i === models.length - 1) {
        throw error;
      }
      console.log(`⚠️ Error with model ${model}, trying next...`);
      continue;
    }
  }
  
  // Should not reach here, but just in case
  throw new Error('All models failed without specific error');
};

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

    // Get API key and models from environment variables
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyByyPyLqSCevZhWA4z21gdL7wxLtCYe-Fg';
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const fallbackModels = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-1.5-flash,gemini-pro').split(',').map(m => m.trim());
    const models = [primaryModel, ...fallbackModels];

    console.log('📤 Sending request to Gemini API');
    console.log('📤 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    console.log('📤 Models to try:', models.join(', '));
    console.log('📤 Prompt length:', prompt.length);

    // Try with primary model and fallbacks
    const result = await tryGeminiWithFallback(apiKey, prompt, models);

    if (result.success) {
      const botResponse = result.data.candidates[0].content.parts[0].text;
      console.log('✅ Extracted Bot Response:', botResponse);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: botResponse }),
      };
    } else if (result.quotaError) {
      // Handle quota error with user-friendly message
      const retryAfter = extractRetryInfo(result.errorData);
      const retryMessage = retryAfter 
        ? `Please try again in ${retryAfter} minutes.`
        : 'Please try again in a few minutes.';
      
      const userMessage = `I apologize, but I'm currently experiencing high demand and my quota has been temporarily exceeded. ${retryMessage} If you need immediate assistance, please contact our team directly at arezk@cloudastick.com.`;
      
      console.error('❌ Quota exceeded for all models');
      
      return {
        statusCode: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: userMessage,
          quotaExceeded: true,
          retryAfter: retryAfter || 5
        }),
      };
    }

  } catch (error) {
    console.error('❌ Netlify Function Cloudiator API error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Full Error Object:', error);
    
    // Check if error message contains quota information
    const isQuota = error.message.toLowerCase().includes('quota') || 
                    error.message.toLowerCase().includes('429');
    
    const userMessage = isQuota
      ? `I apologize, but I'm currently experiencing high demand. Please try again in a few minutes, or contact our team directly at arezk@cloudastick.com for immediate assistance.`
      : `I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact our team directly at arezk@cloudastick.com.`;
    
    return {
      statusCode: isQuota ? 429 : 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: userMessage,
        quotaExceeded: isQuota
      }),
    };
  }
};
