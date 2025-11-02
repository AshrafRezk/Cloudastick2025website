# Environment Variables Setup Guide

## 🔐 API Keys Required

The optimized Company Intelligence system requires **only ONE API key**:

### 1. NewsAPI (Already Provided) ✅
- **Service**: NewsAPI - News & Events
- **Key**: `4dad98892f774d658e37ff52fd225cca`
- **Free Tier**: 100 requests/day (3000/month)
- **Usage**: Fetch company news and industry events
- **Cost**: **FREE forever!**

### 2. Gemini API (Already Configured) ✅
- **Service**: Google Gemini AI
- **Already configured**: Yes ✅
- **Usage**: Generate AI insights

## 🎯 No Company Enrichment API Needed!

We've optimized the system to use **intelligent domain analysis** and **news-enhanced detection**:
- ✅ Company name extracted from domain
- ✅ Industry detected from domain keywords
- ✅ Industry refined using news content
- ✅ Location extracted from news
- ✅ 100% free, no credit limits!

## 📝 How to Add Environment Variables

### Option 1: Netlify Dashboard (Recommended for Production)

1. Go to Netlify Dashboard: https://app.netlify.com
2. Select your site: "Cloudastick2025website"
3. Go to: **Site settings** → **Environment variables**
4. Add these variables:

```
Variable Name: NEWSAPI_KEY
Value: 4dad98892f774d658e37ff52fd225cca

Variable Name: GEMINI_API_KEY
Value: [Already configured]
```

5. Click **Save**
6. Go to **Deploys** → **Trigger deploy** → **Deploy site**

### Option 2: Local Development (.env file)

1. Create a file named `.env` in the project root
2. Add these lines:

```bash
# NewsAPI (only API key needed!)
NEWSAPI_KEY=4dad98892f774d658e37ff52fd225cca

# Gemini (already configured)
GEMINI_API_KEY=AIzaSyByyPyLqSCevZhWA4z21gdL7wxLtCYe-Fg
GEMINI_MODEL=gemini-2.0-flash

# Server
PORT=3001
CORS_ORIGIN=*
```

3. The `.env` file is already in `.gitignore` - it won't be committed ✅

### Option 3: Netlify CLI

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variable (that's it!)
netlify env:set NEWSAPI_KEY "4dad98892f774d658e37ff52fd225cca"

# Deploy
netlify deploy --prod
```

## 🎉 That's All You Need!

Only **ONE** API key required - and you already have it!

No signups, no credit limits, completely free forever!

## ✅ Verify Configuration

After adding the keys:

1. Check Netlify environment variables are set
2. Trigger a new deploy
3. Open your site
4. Go to `/salesforce-power`
5. Enter a company website (e.g., "emaar.com")
6. Check browser console for:
   - ✅ "🏢 Company Enrichment - Request received"
   - ✅ "📰 News Fetching - Request received"
   - ✅ "🤖 Mira Debug - Starting API call"

## 🔍 Troubleshooting

### NewsAPI not working?
- Verify key is correct in Netlify env variables
- Check you haven't exceeded 100 requests/day
- NewsAPI free tier doesn't work on localhost - deploy to Netlify

### No company intelligence showing?
- Check browser console for errors
- Verify NEWSAPI_KEY is set in Netlify
- Trigger a fresh Netlify deploy
- Clear browser cache and localStorage

### Domain analysis not working?
- Should always work (no API needed!)
- Check browser console for JavaScript errors

## 🚀 Ready to Deploy!

You already have everything you need:
- ✅ NewsAPI key (provided): `4dad98892f774d658e37ff52fd225cca`
- ✅ Gemini API (already configured)
- ✅ Smart domain analysis (built-in, no API needed!)

Just add the NewsAPI key to Netlify and deploy! 🎉

**Test with:**
- **Real estate**: emaar.com → Should recommend Cityscape 🏙️
- **Construction**: bechtel.com → Should recommend Memar 🏗️  
- **Generic**: microsoft.com → Stays on Salesforce Power
- **Domain keywords**: propertygroup.com → Instant Cityscape recommendation!

**No signups needed! No waiting! Just deploy and test!** ✨

