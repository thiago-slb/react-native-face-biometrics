import { useCallback, useMemo, useState } from 'react';

import {
  EMPTY_POSE_PROGRESS,
  type FacePoseProgress,
} from '../internal/sessionState';
import {
  createInvalidEmbeddingError,
  isFaceEmbedding,
} from '../internal/validateEmbedding';
import type {
  FaceBiometricsError,
  FaceBiometricsProgressEvent,
  FaceEmbedding,
  FacePose,
  FaceQualityReport,
  FaceRecognitionHook,
  FaceRecognitionResult,
  FaceSessionStatus,
} from '../types';

export function useFaceRecognition(
  knownEmbedding: FaceEmbedding
): FaceRecognitionHook {
  const [state, setState] = useState<FaceSessionStatus>(() =>
    isFaceEmbedding(knownEmbedding) ? 'idle' : 'failed'
  );
  const [progress, setProgress] = useState<FaceBiometricsProgressEvent | null>(
    null
  );
  const [poseProgress, setPoseProgress] =
    useState<FacePoseProgress>(EMPTY_POSE_PROGRESS);
  const [capturedPoses, setCapturedPoses] = useState<readonly FacePose[]>([]);
  const [quality, setQuality] = useState<FaceQualityReport | null>(null);
  const [currentPose, setCurrentPose] = useState<FacePose | null>(null);
  const [result, setResult] = useState<FaceRecognitionResult | null>(null);
  const [error, setError] = useState<FaceBiometricsError | null>(() =>
    isFaceEmbedding(knownEmbedding)
      ? null
      : createInvalidEmbeddingError('Known embedding')
  );

  const reset = useCallback(() => {
    setState(isFaceEmbedding(knownEmbedding) ? 'idle' : 'failed');
    setProgress(null);
    setPoseProgress(EMPTY_POSE_PROGRESS);
    setCapturedPoses([]);
    setQuality(null);
    setCurrentPose(null);
    setResult(null);
    setError(
      isFaceEmbedding(knownEmbedding)
        ? null
        : createInvalidEmbeddingError('Known embedding')
    );
  }, [knownEmbedding]);

  const cancel = useCallback(() => {
    setState('cancelled');
  }, []);

  const callbacks = useMemo(
    () => ({
      onProgress: (event: FaceBiometricsProgressEvent) => {
        setState('active');
        setProgress(event);
        setCapturedPoses(event.capturedPoses);
        setPoseProgress(createPoseProgress(event.capturedPoses));
        setCurrentPose(event.currentPose ?? null);
      },
      onQualityChanged: (nextQuality: FaceQualityReport) => {
        setQuality(nextQuality);
      },
      onPoseChanged: (pose: FacePose, event: FaceBiometricsProgressEvent) => {
        setCurrentPose(pose);
        setProgress(event);
        setCapturedPoses(
          event.capturedPoses.includes(pose)
            ? event.capturedPoses
            : [...event.capturedPoses, pose]
        );
        setPoseProgress({
          ...createPoseProgress(event.capturedPoses),
          [pose]: true,
        });
      },
      onRecognitionComplete: (nextResult: FaceRecognitionResult) => {
        setState('completed');
        setResult(nextResult);
        setQuality(nextResult.quality);
      },
      onError: (nextError: FaceBiometricsError) => {
        setState('failed');
        setError(nextError);
      },
    }),
    []
  );

  return {
    state,
    progress,
    poseProgress,
    capturedPoses,
    quality,
    currentPose,
    result,
    error,
    callbacks,
    reset,
    cancel,
  };
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
