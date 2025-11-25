#!/bin/bash
echo "Testing webhook endpoint..."
curl -X POST https://cloudastick.org/.netlify/functions/salesforceWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "objectType": "Push_Notification__c",
    "recordId": "test123",
    "recordName": "Test Notification",
    "action": "created",
    "additionalData": {
      "Title": "Test Title",
      "Body": "Test Body Content"
    }
  }'
echo ""
