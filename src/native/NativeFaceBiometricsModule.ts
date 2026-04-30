import { NativeModules } from 'react-native';

import {
  DEFAULT_FACE_RECOGNITION_THRESHOLD,
  type FaceBiometricsCameraProps,
  type FacePose,
} from '../types';
import {
  DEFAULT_MAX_BLUR,
  DEFAULT_MIN_BRIGHTNESS,
  DEFAULT_MIN_SHARPNESS,
  DEFAULT_REQUIRED_POSES,
  DEFAULT_STABILITY_MS,
  DEFAULT_TARGET_ANALYSIS_FPS,
} from '../internal/defaults';

export interface FaceBiometricsSessionConfig {
  sessionId: string;
  mode: FaceBiometricsCameraProps['mode'];
  requiredPoses: readonly FacePose[];
  minBrightness: number;
  minSharpness: number;
  maxBlur: number;
  stabilityMs: number;
  targetAnalysisFps: number;
  threshold?: number;
  knownEmbedding?: readonly number[];
}

interface NativeFaceBiometricsModuleShape {
  startSession?: (config: FaceBiometricsSessionConfig) => Promise<void> | void;
  pauseSession?: (sessionId: string) => Promise<void> | void;
  resumeSession?: (sessionId: string) => Promise<void> | void;
  cancelSession?: (sessionId: string) => Promise<void> | void;
  resetSession?: (sessionId: string) => Promise<void> | void;
  disposeSession?: (sessionId: string) => Promise<void> | void;
}

const nativeModule = NativeModules.FaceBiometrics as
  | NativeFaceBiometricsModuleShape
  | undefined;

export function buildSessionConfig(
  sessionId: string,
  props: FaceBiometricsCameraProps
): FaceBiometricsSessionConfig {
  return {
    sessionId,
    mode: props.mode,
    requiredPoses: props.requiredPoses ?? DEFAULT_REQUIRED_POSES,
    minBrightness: props.minBrightness ?? DEFAULT_MIN_BRIGHTNESS,
    minSharpness: props.minSharpness ?? DEFAULT_MIN_SHARPNESS,
    maxBlur: props.maxBlur ?? DEFAULT_MAX_BLUR,
    stabilityMs: props.stabilityMs ?? DEFAULT_STABILITY_MS,
    targetAnalysisFps: DEFAULT_TARGET_ANALYSIS_FPS,
    threshold:
      props.mode === 'recognize'
        ? (props.threshold ?? DEFAULT_FACE_RECOGNITION_THRESHOLD)
        : undefined,
    knownEmbedding:
      props.mode === 'recognize' ? props.knownEmbedding : undefined,
  };
}

export const NativeFaceBiometricsModule = {
  startSession(config: FaceBiometricsSessionConfig): Promise<void> {
    return Promise.resolve(nativeModule?.startSession?.(config));
  },
  pauseSession(sessionId: string): Promise<void> {
    return Promise.resolve(nativeModule?.pauseSession?.(sessionId));
  },
  resumeSession(sessionId: string): Promise<void> {
    return Promise.resolve(nativeModule?.resumeSession?.(sessionId));
  },
  cancelSession(sessionId: string): Promise<void> {
    return Promise.resolve(nativeModule?.cancelSession?.(sessionId));
  },
  resetSession(sessionId: string): Promise<void> {
    return Promise.resolve(nativeModule?.resetSession?.(sessionId));
  },
  disposeSession(sessionId: string): Promise<void> {
    return Promise.resolve(nativeModule?.disposeSession?.(sessionId));
  },
};
