import type {
  FaceBiometricsError,
  FaceBiometricsProgressEvent,
  FacePose,
  FaceQualityReport,
  FaceSessionStatus,
} from '../types';

export type FacePoseProgress = Readonly<Record<FacePose, boolean>>;

export interface BaseFaceSessionState<TResult> {
  state: FaceSessionStatus;
  progress: FaceBiometricsProgressEvent | null;
  poseProgress: FacePoseProgress;
  capturedPoses: readonly FacePose[];
  quality: FaceQualityReport | null;
  currentPose: FacePose | null;
  result: TResult | null;
  error: FaceBiometricsError | null;
}

export type FaceSessionAction<TResult> =
  | { type: 'reset' }
  | { type: 'requestPermission' }
  | { type: 'cancel' }
  | { type: 'progress'; payload: FaceBiometricsProgressEvent }
  | {
      type: 'poseChanged';
      pose: FacePose;
      progress: FaceBiometricsProgressEvent;
    }
  | { type: 'qualityChanged'; payload: FaceQualityReport }
  | { type: 'complete'; payload: TResult; quality: FaceQualityReport }
  | { type: 'error'; payload: FaceBiometricsError };

export const EMPTY_POSE_PROGRESS: FacePoseProgress = {
  center: false,
  left: false,
  right: false,
  up: false,
  down: false,
};

export function createInitialFaceSessionState<
  TResult,
>(): BaseFaceSessionState<TResult> {
  return {
    state: 'idle',
    progress: null,
    poseProgress: EMPTY_POSE_PROGRESS,
    capturedPoses: [],
    quality: null,
    currentPose: null,
    result: null,
    error: null,
  };
}

export function faceSessionReducer<TResult>(
  state: BaseFaceSessionState<TResult>,
  action: FaceSessionAction<TResult>
): BaseFaceSessionState<TResult> {
  switch (action.type) {
    case 'reset':
      return createInitialFaceSessionState<TResult>();
    case 'requestPermission':
      return {
        ...state,
        state: 'requestingPermission',
        error: null,
      };
    case 'cancel':
      return {
        ...state,
        state: 'cancelled',
      };
    case 'progress':
      return {
        ...state,
        state: 'active',
        progress: action.payload,
        poseProgress: createPoseProgress(action.payload.capturedPoses),
        capturedPoses: action.payload.capturedPoses,
        currentPose: action.payload.currentPose ?? null,
        error: null,
      };
    case 'poseChanged':
      return {
        ...state,
        state: 'active',
        progress: action.progress,
        poseProgress: {
          ...createPoseProgress(action.progress.capturedPoses),
          [action.pose]: true,
        },
        capturedPoses: action.progress.capturedPoses.includes(action.pose)
          ? action.progress.capturedPoses
          : [...action.progress.capturedPoses, action.pose],
        currentPose: action.pose,
        error: null,
      };
    case 'qualityChanged':
      return {
        ...state,
        quality: action.payload,
      };
    case 'complete':
      return {
        ...state,
        state: 'completed',
        quality: action.quality,
        result: action.payload,
        error: null,
      };
    case 'error':
      return {
        ...state,
        state: 'failed',
        error: action.payload,
      };
  }
}

function createPoseProgress(
  capturedPoses: readonly FacePose[]
): FacePoseProgress {
  return capturedPoses.reduce<FacePoseProgress>(
    (nextProgress, pose) => ({
      ...nextProgress,
      [pose]: true,
    }),
    EMPTY_POSE_PROGRESS
  );
}
