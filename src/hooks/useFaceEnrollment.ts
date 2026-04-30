import { useCallback, useMemo, useState } from 'react';

import type {
  FaceBiometricsError,
  FaceBiometricsProgressEvent,
  FaceEnrollmentHook,
  FaceEnrollmentResult,
  FacePose,
  FaceQualityReport,
  FaceSessionStatus,
} from '../types';

export function useFaceEnrollment(): FaceEnrollmentHook {
  const [state, setState] = useState<FaceSessionStatus>('idle');
  const [progress, setProgress] = useState<FaceBiometricsProgressEvent | null>(
    null
  );
  const [quality, setQuality] = useState<FaceQualityReport | null>(null);
  const [currentPose, setCurrentPose] = useState<FacePose | null>(null);
  const [result, setResult] = useState<FaceEnrollmentResult | null>(null);
  const [error, setError] = useState<FaceBiometricsError | null>(null);

  const reset = useCallback(() => {
    setState('idle');
    setProgress(null);
    setQuality(null);
    setCurrentPose(null);
    setResult(null);
    setError(null);
  }, []);

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
      onEnrollmentComplete: (nextResult: FaceEnrollmentResult) => {
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
