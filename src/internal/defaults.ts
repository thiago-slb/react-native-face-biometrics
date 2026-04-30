import type { FacePose } from '../types';

export const DEFAULT_REQUIRED_POSES: readonly FacePose[] = ['center'];
export const DEFAULT_MIN_BRIGHTNESS = 0.25;
export const DEFAULT_MIN_SHARPNESS = 0.35;
export const DEFAULT_MAX_BLUR = 0.45;
export const DEFAULT_STABILITY_MS = 500;
export const DEFAULT_TARGET_ANALYSIS_FPS = 5;
