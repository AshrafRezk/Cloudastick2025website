# Netlify Functions for Cloudiator

This directory contains Netlify Functions for the Cloudiator AI chatbot.

## Files

- `cloudiator.js` - Main function that handles Cloudiator API requests

## Environment Variables

Set these in your Netlify dashboard under Site Settings > Environment Variables:

```
GEMINI_API_KEY=AIzaSyByyPyLqSCevZhWA4z21gdL7wxLtCYe-Fg
GEMINI_MODEL=gemini-2.0-flash
```

## How it Works

1. Frontend calls `/.netlify/functions/cloudiator`
2. Netlify Function receives the request
3. Function calls Gemini API with the prompt
4. Function returns the response to the frontend

## Testing Locally

To test the function locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development server
netlify dev
```

The function will be available at `http://localhost:8888/.netlify/functions/cloudiator`

## Deployment

The function is automatically deployed when you push to your Git repository. Make sure to set the environment variables in your Netlify dashboard.
