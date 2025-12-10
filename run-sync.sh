#!/bin/bash
# Quick script to run Salesforce Bulk Sync
# Usage: ./run-sync.sh ACCESS_TOKEN INSTANCE_URL

if [ $# -lt 2 ]; then
  echo "Usage: ./run-sync.sh ACCESS_TOKEN INSTANCE_URL"
  echo ""
  echo "To get your credentials:"
  echo "1. Open your site in browser"
  echo "2. Log in"
  echo "3. Open browser console (F12)"
  echo "4. Run: localStorage.getItem('salesforce_auth_data')"
  echo "5. Copy access_token and instance_url from the result"
  exit 1
fi

ACCESS_TOKEN=$1
INSTANCE_URL=$2

echo "🔄 Running Salesforce Bulk Sync..."
echo "📍 Instance: $INSTANCE_URL"
echo ""

curl -X POST https://cloudastick.org/.netlify/functions/syncSalesforceBulk \
  -H "Content-Type: application/json" \
  -d "{
    \"access_token\": \"$ACCESS_TOKEN\",
    \"instance_url\": \"$INSTANCE_URL\",
    \"clearCacheFirst\": true
  }" | jq '.'

echo ""
echo "✅ Done!"
