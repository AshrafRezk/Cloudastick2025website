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
      `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': config.GEMINI_API_KEY
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
    
    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error('❌ Backend Cloudiator API error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Full Error Object:', error);
    
    res.status(500).json({ 
      error: `I apologize, but I'm experiencing technical difficulties. Error: ${error.message}. Please try again in a moment or contact our team directly at arezk@cloudastick.com.` 
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
