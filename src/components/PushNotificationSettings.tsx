/**
 * Push Notification Settings Component
 * Allows users to enable/disable push notifications
 */

import { useState } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, BellOff, AlertCircle } from 'lucide-react';

interface PushNotificationSettingsProps {
  userId?: string;
  salesforceObjectType?: string; // e.g., 'Case', 'Lead', 'Opportunity'
}

export function PushNotificationSettings({
  userId,
  salesforceObjectType = 'Case' // Default to Case object
}: PushNotificationSettingsProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    requestPermission
  } = usePushNotifications({
    userId,
    salesforceObjectType
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handleToggle = async (enabled: boolean) => {
    setLocalError(null);
    try {
      if (enabled) {
        if (permission !== 'granted') {
          await requestPermission();
        }
        if (permission === 'granted') {
          await subscribe();
        }
      } else {
        await unsubscribe();
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to update notification settings');
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive notifications from Salesforce {salesforceObjectType} objects even when the app is closed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || localError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || localError}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="text-base">
              Enable Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              {permission === 'granted'
                ? 'You will receive notifications for new Salesforce records'
                : permission === 'denied'
                ? 'Notification permission is denied. Please enable it in your browser settings.'
                : 'Click to enable push notifications'}
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={isLoading || permission === 'denied'}
          />
        </div>

        {permission === 'default' && !isSubscribed && (
          <Button
            onClick={async () => {
              try {
                await requestPermission();
                if (permission === 'granted') {
                  await subscribe();
                }
              } catch (err) {
                setLocalError(err instanceof Error ? err.message : 'Failed to enable notifications');
              }
            }}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Enable Notifications'}
          </Button>
        )}

        {permission === 'denied' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Notification permission is denied. Please enable it in your browser settings to receive push notifications.
            </AlertDescription>
          </Alert>
        )}

        {isSubscribed && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription>
              Push notifications are enabled. You will receive notifications for new {salesforceObjectType} records in Salesforce.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

