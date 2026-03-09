import { detectDevice } from '../deviceDetector';

describe('deviceDetector', () => {
    const originalNavigator = global.navigator;
    const originalWindow = global.window;

    beforeEach(() => {
        // Mock navigator
        Object.defineProperty(global, 'navigator', {
            value: { userAgent: '' },
            configurable: true,
            writable: true
        });
        // Mock window
        Object.defineProperty(global, 'window', {
            value: { innerWidth: 1024, innerHeight: 768 },
            configurable: true,
            writable: true
        });
    });

    afterAll(() => {
        global.navigator = originalNavigator;
        global.window = originalWindow;
    });

    it('detects macOS Desktop', () => {
        (global.navigator as any).userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        const result = detectDevice();
        expect(result.os).toBe('macOS');
        expect(result.deviceType).toBe('Desktop');
        expect(result.isApple).toBe(true);
    });

    it('detects iPhone Mobile', () => {
        (global.navigator as any).userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
        const result = detectDevice();
        expect(result.os).toBe('iOS');
        expect(result.deviceType).toBe('Mobile');
        expect(result.isApple).toBe(true);
    });

    it('detects Android Mobile', () => {
        (global.navigator as any).userAgent = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36';
        const result = detectDevice();
        expect(result.os).toBe('Android');
        expect(result.deviceType).toBe('Mobile');
        expect(result.isApple).toBe(false);
    });

    it('detects Tablet', () => {
        (global.navigator as any).userAgent = 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
        const result = detectDevice();
        expect(result.deviceType).toBe('Tablet');
    });

    it('detects Smart TV', () => {
        (global.navigator as any).userAgent = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 WebAppManager';
        const result = detectDevice();
        expect(result.deviceType).toBe('TV');
    });

    it('detects Large Screen (4K)', () => {
        (global.window as any).innerWidth = 3840;
        (global.window as any).innerHeight = 2160;
        (global.navigator as any).userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        const result = detectDevice();
        expect(result.isLargeScreen).toBe(true);
    });
});
