import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface TrackingData {
    sfrecordId: string;
    recordType: 'Lead' | 'Opportunity' | 'Account' | 'Contact';
    sessionId: string;
    browser: {
        userAgent: string;
        language: string;
        platform: string;
    };
    device: {
        screenSize: string;
        orientation: string;
    };
    clicks: Array<{
        element: string;
        text: string;
        timestamp: number;
        x: number;
        y: number;
    }>;
    hovers: Record<string, number>; // sectionId -> time spent in ms
    highInterest?: boolean;
    videoOpened?: boolean;
    videoViewDuration?: number; // in seconds
}

export const useUserTracking = (
    enabledSections: string[],
    videoOpened?: boolean,
    videoViewDuration?: number
) => {
    const [searchParams] = useSearchParams();
    const sfrecordId = searchParams.get('sfrecordId') || searchParams.get('sfrecordid');

    // Detect record type based on Salesforce ID prefix
    const getRecordType = (id: string | null): TrackingData['recordType'] => {
        if (!id) return 'Lead';
        if (id.startsWith('00Q')) return 'Lead';
        if (id.startsWith('006')) return 'Opportunity';
        if (id.startsWith('001')) return 'Account';
        if (id.startsWith('003')) return 'Contact';
        return 'Lead'; // Default fallback
    };

    const recordType = getRecordType(sfrecordId);

    const trackingDataRef = useRef<TrackingData>({
        sfrecordId: sfrecordId || '',
        recordType: recordType,
        sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        browser: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
        },
        device: {
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            orientation: window.screen.orientation?.type || 'unknown',
        },
        clicks: [],
        hovers: {},
    });

    // Update video tracking data when it changes
    useEffect(() => {
        if (videoOpened) {
            trackingDataRef.current.videoOpened = true;
        }
    }, [videoOpened]);

    useEffect(() => {
        if (videoViewDuration !== undefined) {
            trackingDataRef.current.videoViewDuration = videoViewDuration;
        }
    }, [videoViewDuration]);

    const isTrackingStopped = useRef(false);
    const lastSectionRef = useRef<string | null>(null);
    const sectionStartTimeRef = useRef<number>(Date.now());

    const sendTrackingData = useCallback(async (isInitial = false) => {
        if (!sfrecordId || isTrackingStopped.current) return;

        // Update time for current section if not the initial ping
        if (!isInitial && lastSectionRef.current) {
            const duration = Date.now() - sectionStartTimeRef.current;
            trackingDataRef.current.hovers[lastSectionRef.current] =
                (trackingDataRef.current.hovers[lastSectionRef.current] || 0) + duration;
            sectionStartTimeRef.current = Date.now();
        }

        try {
            console.log(`📊 Syncing tracking data [Session: ${trackingDataRef.current.sessionId}]`);
            const response = await fetch('/.netlify/functions/logUserIntent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trackingDataRef.current),
            });

            if (response.ok) {
                console.log('✅ Tracking data synced successfully');
            }
        } catch (error) {
            console.error('❌ Failed to sync tracking data:', error);
        }
    }, [sfrecordId]);

    useEffect(() => {
        if (!sfrecordId) {
            console.log('ℹ️ User tracking disabled: No sfrecordId found.');
            return;
        }

        console.log('🚀 User tracking enabled for lead:', sfrecordId);

        // Immediate Arrival Ping removed as per interaction-only requirement

        const handleClick = (e: MouseEvent) => {
            if (isTrackingStopped.current) return;

            const target = e.target as HTMLElement;
            const clickText = target.innerText || '';

            trackingDataRef.current.clicks.push({
                element: target.tagName,
                text: clickText.substring(0, 50),
                timestamp: Date.now(),
                x: e.clientX,
                y: e.clientY,
            });

            // Detection: check if this specific click is the transition to High Interest
            const isInterestClick = clickText.toLowerCase().includes('is interested');
            if (isInterestClick) {
                trackingDataRef.current.highInterest = true;
            }

            // Trigger immediate sync on click
            sendTrackingData();

            // STOP TRACKING if interest was expressed
            if (isInterestClick) {
                console.log('⏹️ Target interest expressed. Halting further tracking.');
                isTrackingStopped.current = true;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isTrackingStopped.current) return;

            const target = e.target as HTMLElement;
            const section = target.closest('section[id], div[id]')?.id;

            if (section && enabledSections.includes(section)) {
                if (section !== lastSectionRef.current) {
                    if (lastSectionRef.current) {
                        const duration = Date.now() - sectionStartTimeRef.current;
                        trackingDataRef.current.hovers[lastSectionRef.current] =
                            (trackingDataRef.current.hovers[lastSectionRef.current] || 0) + duration;
                    }
                    lastSectionRef.current = section;
                    sectionStartTimeRef.current = Date.now();
                }
            }
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('mousemove', handleMouseMove);

        const handleUnload = () => {
            if (isTrackingStopped.current) return;

            if (lastSectionRef.current) {
                const duration = Date.now() - sectionStartTimeRef.current;
                trackingDataRef.current.hovers[lastSectionRef.current] =
                    (trackingDataRef.current.hovers[lastSectionRef.current] || 0) + duration;
            }

            const blob = new Blob([JSON.stringify(trackingDataRef.current)], { type: 'application/json' });
            navigator.sendBeacon('/.netlify/functions/logUserIntent', blob);
            console.log('📤 Final tracking data sent via beacon');
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [sfrecordId, enabledSections, sendTrackingData]);

    return null;
};
