import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface TrackingData {
    sfrecordId: string;
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
}

export const useUserTracking = (enabledSections: string[]) => {
    const [searchParams] = useSearchParams();
    const sfrecordId = searchParams.get('sfrecordId') || searchParams.get('sfrecordid');

    const trackingDataRef = useRef<TrackingData>({
        sfrecordId: sfrecordId || '',
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

    const lastSectionRef = useRef<string | null>(null);
    const sectionStartTimeRef = useRef<number>(Date.now());

    const sendTrackingData = useCallback(async () => {
        if (!sfrecordId) return;

        // Update time for the current section before sending
        if (lastSectionRef.current) {
            const duration = Date.now() - sectionStartTimeRef.current;
            trackingDataRef.current.hovers[lastSectionRef.current] =
                (trackingDataRef.current.hovers[lastSectionRef.current] || 0) + duration;
            sectionStartTimeRef.current = Date.now();
        }

        try {
            console.log('📊 Submitting user tracking data for lead:', sfrecordId);
            const response = await fetch('/.netlify/functions/logUserIntent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trackingDataRef.current),
            });

            if (response.ok) {
                console.log('✅ Tracking data submitted successfully');
            } else {
                console.warn('⚠️ Tracking data submission failed with status:', response.status);
            }
        } catch (error) {
            console.error('❌ Failed to send tracking data:', error);
        }
    }, [sfrecordId]);

    useEffect(() => {
        if (!sfrecordId) {
            console.log('ℹ️ User tracking disabled: No sfrecordId found in URL.');
            return;
        }

        console.log('🚀 User tracking enabled for lead:', sfrecordId);

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            trackingDataRef.current.clicks.push({
                element: target.tagName,
                text: target.innerText?.substring(0, 50) || '',
                timestamp: Date.now(),
                x: e.clientX,
                y: e.clientY,
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
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

        const interval = setInterval(sendTrackingData, 30000);

        const handleUnload = () => {
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
            clearInterval(interval);
        };
    }, [sfrecordId, enabledSections, sendTrackingData]);

    return null;
};
