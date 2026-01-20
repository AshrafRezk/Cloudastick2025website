/**
 * Simple utility to extract the dominant color from an image URL.
 * Returns a hex color string (e.g. "#FF5500") or null if failed/CORS issues.
 */
export const extractDominantColor = async (imageUrl: string | null): Promise<string | null> => {
    if (!imageUrl) return null;

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }

                // Draw the image resized to 1x1 to get average color
                ctx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

                // Convert to hex
                const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                resolve(hex);
            } catch (e) {
                // Likely CORS error
                console.warn('Color extraction failed (likely CORS):', e);
                resolve(null);
            }
        };

        img.onerror = () => {
            resolve(null);
        };
    });
};
