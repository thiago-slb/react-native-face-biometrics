import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export const FACE_EMBEDDING_DIMENSIONS = 128;
export const DEFAULT_FACE_RECOGNITION_THRESHOLD = 0.6;
export const FACE_EMBEDDING_SCHEMA_VERSION = 'face-embedding-128d-v1';

/**
 * Compact face encoding produced by the native embedding model.
 *
 * Runtime helpers validate this as exactly 128 finite numbers. JavaScript may
 * compare or store this caller-owned value, but must never receive raw frames,
 * face crops, image buffers, temporary image paths, or model tensors.
 */
export type FaceEmbedding = readonly number[];

export type FacePose = 'center' | 'left' | 'right' | 'up' | 'down';

export type FaceBiometricsMode = 'enroll' | 'recognize';

export type FaceDistanceMetric = 'euclidean';

export type FaceBiometricsErrorCode =
  | 'permissionDenied'
  | 'cameraUnavailable'
  | 'noFace'
  | 'multipleFaces'
  | 'lowQuality'
  | 'poseTimeout'
  | 'modelUnavailable'
  | 'embeddingFailed'
  | 'comparisonFailed'
  | 'invalidEmbedding'
  | 'invalidConfiguration'
  | 'notImplemented'
  | 'internalError';

export type FaceBiometricsWarningCode =
  | 'poorLighting'
  | 'faceTooClose'
  | 'faceTooFar'
  | 'faceOffCenter'
  | 'unstablePose'
  | 'slowDevice';

export interface FaceModelMetadata {
  embeddingSchemaVersion: typeof FACE_EMBEDDING_SCHEMA_VERSION | string;
  modelId: string;
  modelVersion: string;
  preprocessingVersion: string;
  distanceMetric: FaceDistanceMetric;
}

export interface FaceBiometricsError {
  code: FaceBiometricsErrorCode;
  message: string;
  nativeCode?: string;
  recoverable: boolean;
}

export interface FaceBiometricsWarning {
  code: FaceBiometricsWarningCode;
  message: string;
}

export interface FaceQualityReport {
  brightness: number;
  sharpness: number;
  blur: number;
  faceSizeRatio: number;
  centeredness: number;
  distance: number;
  poseScore: number;
  stability: number;
  passed: boolean;
  warnings: readonly FaceBiometricsWarning[];
}

export interface CapturedPoseMetadata {
  pose: FacePose;
  capturedAtMs: number;
  yawDegrees?: number;
  pitchDegrees?: number;
  rollDegrees?: number;
  quality: FaceQualityReport;
}

export interface BestFrameMetadata {
  pose: FacePose;
  score: number;
  capturedAtMs: number;
  width: number;
  height: number;
}

export interface FaceBiometricsProgressEvent {
  mode: FaceBiometricsMode;
  requiredPoses: readonly FacePose[];
  capturedPoses: readonly FacePose[];
  currentPose?: FacePose;
  progress: number;
}

export interface FaceEnrollmentResult {
  mode: 'enroll';
  embedding: FaceEmbedding;
  quality: FaceQualityReport;
  capturedPoses: readonly CapturedPoseMetadata[];
  bestFrames: readonly BestFrameMetadata[];
  metadata: FaceModelMetadata;
}

export interface FaceRecognitionResult {
  mode: 'recognize';
  match: boolean;
  distance: number;
  threshold: number;
  embedding: FaceEmbedding;
  quality: FaceQualityReport;
  capturedPoses: readonly CapturedPoseMetadata[];
  metadata: FaceModelMetadata;
}

export interface CompareFaceEmbeddingsResult {
  match: boolean;
  distance: number;
  threshold: number;
}

export interface FaceBiometricsSharedCallbacks {
  onProgress?: (event: FaceBiometricsProgressEvent) => void;
  onQualityChanged?: (quality: FaceQualityReport) => void;
  onPoseChanged?: (pose: FacePose, event: FaceBiometricsProgressEvent) => void;
  onError?: (error: FaceBiometricsError) => void;
}

export interface FaceBiometricsSharedOptions extends FaceBiometricsSharedCallbacks {
  requiredPoses?: readonly FacePose[];
  minBrightness?: number;
  minSharpness?: number;
  maxBlur?: number;
  stabilityMs?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export interface FaceEnrollmentCameraProps extends FaceBiometricsSharedOptions {
  mode: 'enroll';
  knownEmbedding?: never;
  threshold?: never;
  onEnrollmentComplete?: (result: FaceEnrollmentResult) => void;
  onRecognitionComplete?: never;
}

export interface FaceRecognitionCameraProps extends FaceBiometricsSharedOptions {
  mode: 'recognize';
  knownEmbedding: FaceEmbedding;
  threshold?: number;
  onEnrollmentComplete?: never;
  onRecognitionComplete?: (result: FaceRecognitionResult) => void;
}

export type FaceBiometricsCameraProps =
  | FaceEnrollmentCameraProps
  | FaceRecognitionCameraProps;

export type FaceSessionStatus =
  | 'idle'
  | 'requestingPermission'
  | 'active'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface FaceEnrollmentHookState {
  state: FaceSessionStatus;
  progress: FaceBiometricsProgressEvent | null;
  quality: FaceQualityReport | null;
  currentPose: FacePose | null;
  result: FaceEnrollmentResult | null;
  error: FaceBiometricsError | null;
}

export interface FaceRecognitionHookState {
  state: FaceSessionStatus;
  progress: FaceBiometricsProgressEvent | null;
  quality: FaceQualityReport | null;
  currentPose: FacePose | null;
  result: FaceRecognitionResult | null;
  error: FaceBiometricsError | null;
}

export interface FaceEnrollmentHook extends FaceEnrollmentHookState {
  callbacks: Pick<
    FaceEnrollmentCameraProps,
    | 'onProgress'
    | 'onQualityChanged'
    | 'onPoseChanged'
    | 'onEnrollmentComplete'
    | 'onError'
  >;
  reset: () => void;
  cancel: () => void;
}

export interface FaceRecognitionHook extends FaceRecognitionHookState {
  callbacks: Pick<
    FaceRecognitionCameraProps,
    | 'onProgress'
    | 'onQualityChanged'
    | 'onPoseChanged'
    | 'onRecognitionComplete'
    | 'onError'
  >;
  reset: () => void;
  cancel: () => void;
}
