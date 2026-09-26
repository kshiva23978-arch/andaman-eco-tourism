/** Upload rules shared by the browser (instant feedback) and the server (enforcement). */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

/** Accept attribute for the file picker. SVG is deliberately excluded (it can carry script). */
export const ACCEPT_ATTR = ".jpg,.jpeg,.png,.webp,.gif,.avif,.mp4,.webm";
