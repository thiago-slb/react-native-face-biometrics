import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import {
  createInitialFaceSessionState,
  faceSessionReducer,
} from '../internal/sessionState';
import type {
  FaceBiometricsError,
  FaceBiometricsProgressEvent,
  FaceEnrollmentHookOptions,
  FaceEnrollmentHook,
  FaceEnrollmentResult,
  FacePose,
  FaceQualityReport,
} from '../types';

export function useFaceEnrollment(
  options: FaceEnrollmentHookOptions = {}
): FaceEnrollmentHook {
  const mountedRef = useRef(true);
  const [session, dispatch] = useReducer(
    faceSessionReducer<FaceEnrollmentResult>,
    undefined,
    createInitialFaceSessionState<FaceEnrollmentResult>
  );

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dispatchIfMounted = useCallback(
    (action: Parameters<typeof dispatch>[0]) => {
      if (mountedRef.current) {
        dispatch(action);
      }
    },
    []
  );

  const reset = useCallback(() => {
    dispatchIfMounted({ type: 'reset' });
  }, [dispatchIfMounted]);

  const cancel = useCallback(() => {
    dispatchIfMounted({ type: 'cancel' });
  }, [dispatchIfMounted]);

  const callbacks = useMemo(
    () => ({
      onRequestPermission: () => {
        dispatchIfMounted({ type: 'requestPermission' });
      },
      onProgress: (event: FaceBiometricsProgressEvent) => {
        dispatchIfMounted({ type: 'progress', payload: event });
      },
      onQualityChanged: (nextQuality: FaceQualityReport) => {
        dispatchIfMounted({
          type: 'qualityChanged',
          payload: nextQuality,
        });
      },
      onPoseChanged: (pose: FacePose, event: FaceBiometricsProgressEvent) => {
        dispatchIfMounted({
          type: 'poseChanged',
          pose,
          progress: event,
        });
      },
      onEnrollmentComplete: (nextResult: FaceEnrollmentResult) => {
        dispatchIfMounted({
          type: 'complete',
          payload: nextResult,
          quality: nextResult.quality,
        });
      },
      onError: (nextError: FaceBiometricsError) => {
        dispatchIfMounted({ type: 'error', payload: nextError });
      },
    }),
    [dispatchIfMounted]
  );

  const cameraProps = useMemo(
    () => ({
      ...options,
      mode: 'enroll' as const,
      onProgress: callbacks.onProgress,
      onQualityChanged: callbacks.onQualityChanged,
      onPoseChanged: callbacks.onPoseChanged,
      onEnrollmentComplete: callbacks.onEnrollmentComplete,
      onError: callbacks.onError,
    }),
    [callbacks, options]
  );

  return {
    ...session,
    callbacks,
    cameraProps,
    reset,
    cancel,
  };
}
