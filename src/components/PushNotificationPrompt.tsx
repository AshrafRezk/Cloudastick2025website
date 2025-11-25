/**
 * Push Notification Prompt Component
 * Shows a banner/prompt on the home page to enable push notifications
 */

import { useState, useEffect } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { X, Bell } from 'lucide-react';

export function PushNotificationPrompt() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    requestPermission
  } = usePushNotifications({
    salesforceObjectType: 'Push_Notification__c',
    autoSubscribe: false
  });

  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Check if user has previously dismissed the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('push-notification-prompt-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }
    
    // Show prompt after 3 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Don't show if:
  // - Not supported
  // - Already subscribed
  // - Permission denied
  // - User dismissed it
  // - Already granted permission
  // - Prompt hasn't been triggered yet
  if (
    !isSupported ||
    isSubscribed ||
    permission === 'denied' ||
    isDismissed ||
    permission === 'granted' ||
    !showPrompt
  ) {
    return null;
  }

  const handleEnable = async () => {
    try {
      if (permission === 'default') {
        await requestPermission();
      }
      if (permission === 'granted') {
        await subscribe();
      }
      setIsDismissed(true);
      localStorage.setItem('push-notification-prompt-dismissed', 'true');
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('push-notification-prompt-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg shadow-2xl border border-white/20 p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Stay Updated with Push Notifications
            </h3>
            <p className="text-white/90 text-xs mb-3">
              Get instant notifications from Salesforce even when the app is closed.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleEnable}
                disabled={isLoading}
                size="sm"
                variant="secondary"
                className="flex-1 text-xs"
              >
                {isLoading ? 'Enabling...' : 'Enable Notifications'}
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

