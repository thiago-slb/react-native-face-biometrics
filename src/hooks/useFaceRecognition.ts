import { useCallback, useMemo, useState } from 'react';

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
        setCurrentPose(event.currentPose ?? null);
      },
      onQualityChanged: (nextQuality: FaceQualityReport) => {
        setQuality(nextQuality);
      },
      onPoseChanged: (pose: FacePose, event: FaceBiometricsProgressEvent) => {
        setCurrentPose(pose);
        setProgress(event);
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
    quality,
    currentPose,
    result,
    error,
    callbacks,
    reset,
    cancel,
  };
}
