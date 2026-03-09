/**
 * Utility to detect device type and operating system from User Agent and screen properties.
 */

export interface DeviceInfo {
    deviceType: 'Mobile' | 'Tablet' | 'Desktop' | 'TV' | 'Unknown';
    os: 'iOS' | 'Android' | 'macOS' | 'Windows' | 'Linux' | 'ChromeOS' | 'Unknown';
    isApple: boolean;
    isLargeScreen: boolean; // Large TV or 4K monitor
}

export const detectDevice = (): DeviceInfo => {
    const ua = navigator.userAgent;
    const width = window.innerWidth;
    const height = window.innerHeight;

    let deviceType: DeviceInfo['deviceType'] = 'Desktop';
    let os: DeviceInfo['os'] = 'Unknown';

    // 1. Detect OS
    if (/iPad|iPhone|iPod/.test(ua)) {
        os = 'iOS';
        deviceType = 'Mobile';
    } else if (/Android/.test(ua)) {
        os = 'Android';
        deviceType = 'Mobile';
    } else if (/Macintosh|Mac OS X/.test(ua)) {
        os = 'macOS';
    } else if (/Windows/.test(ua)) {
        os = 'Windows';
    } else if (/Linux/.test(ua)) {
        os = 'Linux';
    } else if (/CrOS/.test(ua)) {
        os = 'ChromeOS';
    }

    // 2. Refine Device Type
    if (/Tablet|iPad/.test(ua) || (os === 'Android' && !/Mobile/.test(ua))) {
        deviceType = 'Tablet';
    } else if (/SmartTV|Tizen|NetCast|Web0S|AppleTV|Roku|CastTV/.test(ua)) {
        deviceType = 'TV';
    }

    // 3. Detect Large Screens / TVs based on resolution
    const isLargeScreen = width >= 2560 || height >= 1440; // 1440p+ or 4K
    if (isLargeScreen && deviceType === 'Desktop') {
        // If it's a huge screen but not marked as TV, it could be a 4K monitor or a TV used as a monitor
        // We'll tag it as LargeScreen
    }

    // 4. Apple specific check
    const isApple = ['iOS', 'macOS'].includes(os);

    return {
        deviceType,
        os,
        isApple,
        isLargeScreen
    };
};
