import { NativeEventEmitter, NativeModules } from 'react-native';

import type {
  FaceBiometricsError,
  FaceBiometricsProgressEvent,
  FaceEnrollmentResult,
  FacePose,
  FaceQualityReport,
  FaceRecognitionResult,
} from '../types';

export type NativeFaceBiometricsEvent =
  | {
      type: 'progress';
      sessionId: string;
      payload: FaceBiometricsProgressEvent;
    }
  | {
      type: 'qualityChanged';
      sessionId: string;
      payload: FaceQualityReport;
    }
  | {
      type: 'poseChanged';
      sessionId: string;
      payload: {
        pose: FacePose;
        progress: FaceBiometricsProgressEvent;
      };
    }
  | {
      type: 'enrollmentComplete';
      sessionId: string;
      payload: FaceEnrollmentResult;
    }
  | {
      type: 'recognitionComplete';
      sessionId: string;
      payload: FaceRecognitionResult;
    }
  | {
      type: 'error';
      sessionId: string;
      payload: FaceBiometricsError;
    };

export type NativeFaceBiometricsEventListener = (
  event: NativeFaceBiometricsEvent
) => void;

const nativeEventSource = NativeModules.FaceBiometrics ?? undefined;
const emitter =
  nativeEventSource == null ? null : new NativeEventEmitter(nativeEventSource);

export function subscribeToFaceBiometricsEvents(
  listener: NativeFaceBiometricsEventListener
): () => void {
  if (emitter == null) {
    return () => {};
  }

  const subscription = emitter.addListener('FaceBiometricsEvent', (event) => {
    listener(event as NativeFaceBiometricsEvent);
  });

  return () => {
    subscription.remove();
  };
}
