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
    const sfrecordId = searchParams.get('sfrecordId');

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
            await fetch('/.netlify/functions/logUserIntent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trackingDataRef.current),
            });

            // Optionally clear some data if we don't want to keep resending it
            // For now, let's keep it cumulative as requested ("dont override old logs")
            // Actually, the backend will receive multiple calls and should handle them.
            // To avoid massive payloads, we could clear clicks/resets timers after successful send
            // but the user said "for each time have a different log". 
            // This implies one session = one log or multiple logs per session?
            // "the link could be accessed multiple times ;) for each time have a different log ;)"
            // This refers to different page loads. Within one page load, we should probably accumulate and send at once or in chunks.
        } catch (error) {
            console.error('Failed to send tracking data:', error);
        }
    }, [sfrecordId]);

    useEffect(() => {
        if (!sfrecordId) return;

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
                    // Record duration for previous section
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

        // Periodically send data every 30 seconds
        const interval = setInterval(sendTrackingData, 30000);

        // Send data on page unload
        const handleUnload = () => {
            // Use sendBeacon for more reliability on unload
            if (lastSectionRef.current) {
                const duration = Date.now() - sectionStartTimeRef.current;
                trackingDataRef.current.hovers[lastSectionRef.current] =
                    (trackingDataRef.current.hovers[lastSectionRef.current] || 0) + duration;
            }
            navigator.sendBeacon('/.netlify/functions/logUserIntent', JSON.stringify(trackingDataRef.current));
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
