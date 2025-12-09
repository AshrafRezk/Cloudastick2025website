const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// In-memory storage for push subscriptions (in production, use a database)
const pushSubscriptions = new Map();

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

// Cloudiator API endpoint
app.post('/api/cloudiator', async (req, res) => {
  console.log('🤖 Backend - Cloudiator API call received');
  console.log('📥 Request Method:', req.method);
  console.log('📥 Request Headers:', req.headers);
  console.log('📥 Request Body:', req.body);

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    console.log('❌ Missing prompt in request body');
    return res.status(400).json({ error: 'Prompt is required' });
  }

  console.log('📤 Sending request to Gemini API');
  console.log('📤 API Key (first 10 chars):', config.GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('📤 Model:', config.GEMINI_MODEL);
  console.log('📤 Prompt length:', prompt.length);

  try {
    // Get models list from config
    const primaryModel = config.GEMINI_MODEL;
    const fallbackModels = config.GEMINI_FALLBACK_MODELS || ['gemini-1.5-flash', 'gemini-pro'];
    const models = [primaryModel, ...fallbackModels];

    console.log('📤 Models to try:', models.join(', '));

    // Try with primary model and fallbacks
    const result = await tryGeminiWithFallback(config.GEMINI_API_KEY, prompt, models);

    if (result.success) {
      const botResponse = result.data.candidates[0].content.parts[0].text;
      console.log('✅ Extracted Bot Response:', botResponse);
      
      res.status(200).json({ response: botResponse });
    } else if (result.quotaError) {
      // Handle quota error with user-friendly message
      const retryAfter = extractRetryInfo(result.errorData);
      const retryMessage = retryAfter 
        ? `Please try again in ${retryAfter} minutes.`
        : 'Please try again in a few minutes.';
      
      const userMessage = `I apologize, but I'm currently experiencing high demand and my quota has been temporarily exceeded. ${retryMessage} If you need immediate assistance, please contact our team directly at arezk@cloudastick.com.`;
      
      console.error('❌ Quota exceeded for all models');
      
      res.status(429).json({ 
        error: userMessage,
        quotaExceeded: true,
        retryAfter: retryAfter || 5
      });
    }
  } catch (error) {
    console.error('❌ Backend Cloudiator API error:');
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
    
    res.status(isQuota ? 429 : 500).json({ 
      error: userMessage,
      quotaExceeded: isQuota
    });
  }
});

// Push Notification Endpoints

// Subscribe to push notifications
app.post('/api/push/subscribe', async (req, res) => {
  try {
    const { subscription, userId, salesforceObjectType } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }

    // Store subscription (in production, save to database)
    const subscriptionId = subscription.endpoint;
    pushSubscriptions.set(subscriptionId, {
      subscription,
      userId,
      salesforceObjectType,
      createdAt: new Date().toISOString()
    });

    console.log('📱 Push subscription saved:', {
      subscriptionId,
      userId,
      salesforceObjectType,
      totalSubscriptions: pushSubscriptions.size
    });

    res.status(200).json({ 
      success: true,
      message: 'Subscription saved successfully'
    });
  } catch (error) {
    console.error('❌ Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Unsubscribe from push notifications
app.post('/api/push/unsubscribe', async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }

    // Remove subscription
    const subscriptionId = subscription.endpoint;
    pushSubscriptions.delete(subscriptionId);

    console.log('📱 Push subscription removed:', {
      subscriptionId,
      totalSubscriptions: pushSubscriptions.size
    });

    res.status(200).json({ 
      success: true,
      message: 'Subscription removed successfully'
    });
  } catch (error) {
    console.error('❌ Error removing subscription:', error);
    res.status(500).json({ error: 'Failed to remove subscription' });
  }
});

// Get all subscriptions (for testing/admin purposes)
app.get('/api/push/subscriptions', (req, res) => {
  const subscriptions = Array.from(pushSubscriptions.values());
  res.status(200).json({ 
    count: subscriptions.length,
    subscriptions: subscriptions.map(sub => ({
      userId: sub.userId,
      salesforceObjectType: sub.salesforceObjectType,
      createdAt: sub.createdAt,
      endpoint: sub.subscription.endpoint.substring(0, 50) + '...'
    }))
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 Cloudastick Backend Server Starting...');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🤖 Cloudiator API available at http://localhost:${PORT}/api/cloudiator`);
  console.log(`🔑 API Key configured: ${config.GEMINI_API_KEY.substring(0, 10)}...`);
  console.log(`🧠 Gemini Model: ${config.GEMINI_MODEL}`);
  console.log('✅ Server ready to handle requests!');
});
