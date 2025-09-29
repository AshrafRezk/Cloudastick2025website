# Cloudastick Backend

Backend proxy server for the Cloudastick website and Cloudiator AI chatbot.

## Features

- Secure API proxy for Gemini 2.0 Flash
- CORS enabled for frontend communication
- Static file serving for React app
- Environment-based configuration
- Error handling and logging

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set environment variables:
```bash
# Create .env file with:
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### POST /api/cloudiator
Handles Cloudiator chatbot requests.

**Request:**
```json
{
  "prompt": "Your question here"
}
```

**Response:**
```json
{
  "response": "Cloudiator's response"
}
```

## Security Features

- API key stored securely on backend
- CORS protection
- Input validation
- Error handling
- Rate limiting ready

## Deployment

### Environment Variables
Set these in your hosting platform:
- `GEMINI_API_KEY`: Your Gemini API key
- `GEMINI_MODEL`: Model to use (default: gemini-2.0-flash)
- `PORT`: Server port (default: 3001)

### Build and Deploy
1. Build the frontend: `npm run build`
2. Deploy the backend server
3. Ensure environment variables are set
4. The server will serve both API and static files

## Development

The server runs on port 3001 by default and serves:
- API endpoints at `/api/*`
- Static React app at all other routes
- CORS enabled for local development
