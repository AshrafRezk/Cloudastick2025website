/**
 * Push Notification Prompt Component
 * Shows a banner/prompt on the home page to enable push notifications
 */

import { useState, useEffect } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { X, Bell, AlertCircle } from 'lucide-react';

export function PushNotificationPrompt() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    requestPermission
  } = usePushNotifications({
    salesforceObjectType: 'Push_Notification__c', // Match your Salesforce object
    autoSubscribe: false
  });

  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('push-notification-prompt-dismissed', 'true');
  };

  // Check if user has previously dismissed the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem('push-notification-prompt-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }
    
    // Check if permission is already denied on page load
    if (Notification.permission === 'denied') {
      console.log('⚠️ Notifications already blocked on page load');
      // Still show the prompt so user knows they need to unblock
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
  // - User dismissed it (unless permission is denied - show help)
  // - Already granted permission
  // - Prompt hasn't been triggered yet
  if (
    !isSupported ||
    isSubscribed ||
    (isDismissed && permission !== 'denied') ||
    (permission === 'granted' && !isSubscribed) ||
    !showPrompt
  ) {
    // Show special message if blocked
    if (permission === 'denied' && showPrompt && !isDismissed) {
      return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-red-600/90 rounded-lg shadow-2xl border border-red-500/50 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-1">
                  Notifications Are Blocked
                </h3>
                <p className="text-white/90 text-xs mb-3">
                  Notifications are blocked in your browser. To enable them:
                </p>
                <ol className="text-white/90 text-xs list-decimal list-inside mb-3 space-y-1">
                  <li>Click the lock/info icon in your browser's address bar</li>
                  <li>Find "Notifications" in the permissions list</li>
                  <li>Change it from "Block" to "Allow"</li>
                  <li>Refresh this page</li>
                </ol>
                
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="secondary"
                  className="w-full text-xs"
                >
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const handleEnable = async () => {
    try {
      console.log('🔔 Enable button clicked!');
      console.log('Current permission state:', permission);
      console.log('Current Notification.permission:', Notification.permission);
      
      setLocalError(null);
      
      // Check actual browser permission (might be different from state)
      const actualPermission = Notification.permission;
      console.log('Actual browser permission:', actualPermission);
      
      // If permission is blocked, we can't request it again
      if (actualPermission === 'denied' || permission === 'denied') {
        console.log('❌ Notifications are blocked');
        setLocalError('Notifications are blocked. Please enable them in your browser settings (see instructions below).');
        return;
      }

      // Request permission if not already granted
      if (actualPermission === 'default' || permission === 'default') {
        console.log('📋 Requesting notification permission...');
        
        try {
          await requestPermission();
          
          // Wait a moment for state to update
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Check the actual browser permission after request
          const newPermission = Notification.permission;
          console.log('Permission after request:', newPermission);
          
          if (newPermission === 'denied') {
            console.log('❌ User blocked notifications');
            setLocalError('Notifications were blocked. Please enable them in your browser settings.');
            return;
          }
          
          if (newPermission !== 'granted') {
            console.log('⚠️ Permission not granted:', newPermission);
            setLocalError('Notification permission was not granted.');
            return;
          }
          
          console.log('✅ Permission granted, subscribing...');
          // Permission granted, now subscribe
          await subscribe();
          setIsDismissed(true);
          localStorage.setItem('push-notification-prompt-dismissed', 'true');
        } catch (permError) {
          console.error('❌ Error requesting permission:', permError);
          setLocalError(permError instanceof Error ? permError.message : 'Failed to request notification permission');
          return;
        }
      } else if (actualPermission === 'granted' || permission === 'granted') {
        console.log('✅ Permission already granted, subscribing...');
        // Already granted, just subscribe
        await subscribe();
        setIsDismissed(true);
        localStorage.setItem('push-notification-prompt-dismissed', 'true');
      } else {
        console.log('⚠️ Unknown permission state:', actualPermission, permission);
        setLocalError('Unable to determine notification permission status.');
      }
    } catch (error) {
      console.error('❌ Failed to enable notifications:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to enable notifications');
    }
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
            
            {localError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded p-2 mb-3">
                <p className="text-white text-xs mb-2">{localError}</p>
                {localError.includes('blocked') && (
                  <div className="text-white/80 text-xs space-y-1">
                    <p className="font-semibold">To enable notifications:</p>
                    <ol className="list-decimal list-inside ml-2 space-y-0.5">
                      <li>Click the lock/info icon in your browser's address bar</li>
                      <li>Find "Notifications" in the permissions list</li>
                      <li>Change it from "Block" to "Allow"</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔔 Button onClick triggered!');
                  handleEnable();
                }}
                disabled={isLoading || permission === 'denied'}
                size="sm"
                variant="secondary"
                className="flex-1 text-xs"
                type="button"
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

