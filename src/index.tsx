export { FaceBiometricsCamera } from './FaceBiometricsCamera';
export { useFaceEnrollment } from './hooks/useFaceEnrollment';
export { useFaceRecognition } from './hooks/useFaceRecognition';
export { compareFaceEmbeddings } from './utils/compareFaceEmbeddings';
export { multiply } from './multiply';
export {
  buildSessionConfig,
  NativeFaceBiometricsModule,
} from './native/NativeFaceBiometricsModule';
export { subscribeToFaceBiometricsEvents } from './native/NativeFaceBiometricsEvents';
export {
  assertFaceEmbedding,
  createInvalidEmbeddingError,
  isFaceEmbedding,
} from './internal/validateEmbedding';
export type {
  BestFrameMetadata,
  CapturedPoseMetadata,
  CompareFaceEmbeddingsResult,
  FaceBiometricsCameraProps,
  FaceBiometricsError,
  FaceBiometricsErrorCode,
  FaceBiometricsMode,
  FaceBiometricsProgressEvent,
  FaceBiometricsSharedCallbacks,
  FaceBiometricsSharedOptions,
  FaceBiometricsWarning,
  FaceBiometricsWarningCode,
  FaceDistanceMetric,
  FaceEmbedding,
  FaceEnrollmentCameraProps,
  FaceEnrollmentHook,
  FaceEnrollmentHookState,
  FaceEnrollmentResult,
  FaceModelMetadata,
  FacePose,
  FaceQualityReport,
  FaceRecognitionCameraProps,
  FaceRecognitionHook,
  FaceRecognitionHookState,
  FaceRecognitionResult,
  FaceSessionStatus,
} from './types';
export type { FaceBiometricsSessionConfig } from './native/NativeFaceBiometricsModule';
export type {
  NativeFaceBiometricsEvent,
  NativeFaceBiometricsEventListener,
} from './native/NativeFaceBiometricsEvents';
export {
  DEFAULT_FACE_RECOGNITION_THRESHOLD,
  FACE_EMBEDDING_DIMENSIONS,
  FACE_EMBEDDING_SCHEMA_VERSION,
} from './types';
