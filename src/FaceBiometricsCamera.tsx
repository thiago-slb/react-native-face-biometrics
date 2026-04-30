import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, ReactElement } from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View,
  type AppStateStatus,
} from 'react-native';

import type { FaceBiometricsCameraProps } from './types';
import { validateFaceBiometricsCameraProps } from './internal/validateProps';
import {
  buildSessionConfig,
  NativeFaceBiometricsModule,
} from './native/NativeFaceBiometricsModule';
import {
  subscribeToFaceBiometricsEvents,
  type NativeFaceBiometricsEvent,
} from './native/NativeFaceBiometricsEvents';

type CameraPermissionStatus =
  | 'granted'
  | 'not-determined'
  | 'denied'
  | 'restricted';

interface VisionCameraDevice {
  id: string;
  position: 'front' | 'back' | 'external';
}

type VisionCameraProps = Record<string, unknown>;

type VisionCameraComponent = ComponentType<VisionCameraProps> & {
  getCameraPermissionStatus?: () =>
    | CameraPermissionStatus
    | Promise<CameraPermissionStatus>;
  requestCameraPermission?: () =>
    | CameraPermissionStatus
    | Promise<CameraPermissionStatus>;
  getAvailableCameraDevices?: () =>
    | VisionCameraDevice[]
    | Promise<VisionCameraDevice[]>;
};

interface VisionCameraModule {
  Camera: VisionCameraComponent;
}

declare const require: (moduleName: string) => unknown;

function resolveVisionCameraModule(): VisionCameraModule | null {
  try {
    const moduleValue = require('react-native-vision-camera') as
      | VisionCameraModule
      | undefined;

    return moduleValue?.Camera == null ? null : moduleValue;
  } catch {
    return null;
  }
}

const visionCameraModule = resolveVisionCameraModule();

export function FaceBiometricsCamera(
  props: FaceBiometricsCameraProps
): ReactElement | null {
  const sessionId = useRef(`face-biometrics-${Date.now()}`).current;
  const Camera = visionCameraModule?.Camera;
  const [permissionStatus, setPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [frontDevice, setFrontDevice] = useState<VisionCameraDevice | null>(
    null
  );
  const [isCameraActive, setIsCameraActive] = useState(true);

  const validationError = useMemo(
    () => validateFaceBiometricsCameraProps(props),
    [props]
  );

  useEffect(() => {
    if (validationError != null) {
      props.onError?.(validationError);
    }
  }, [props, validationError]);

  useEffect(() => {
    if (Camera == null) {
      props.onError?.({
        code: 'cameraUnavailable',
        message:
          'react-native-vision-camera is required to render FaceBiometricsCamera.',
        recoverable: false,
      });
      return;
    }

    let cancelled = false;

    async function prepareCamera() {
      const currentStatus =
        (await Camera?.getCameraPermissionStatus?.()) ?? 'not-determined';
      const nextStatus =
        currentStatus === 'not-determined'
          ? ((await Camera?.requestCameraPermission?.()) ?? currentStatus)
          : currentStatus;

      if (cancelled) {
        return;
      }

      setPermissionStatus(nextStatus);

      if (nextStatus !== 'granted') {
        props.onError?.({
          code: 'permissionDenied',
          message: 'Camera permission is required for face biometrics.',
          recoverable: true,
        });
        return;
      }

      const devices = (await Camera?.getAvailableCameraDevices?.()) ?? [];
      const nextFrontDevice =
        devices.find((device) => device.position === 'front') ?? null;

      if (cancelled) {
        return;
      }

      setFrontDevice(nextFrontDevice);

      if (nextFrontDevice == null) {
        props.onError?.({
          code: 'cameraUnavailable',
          message: 'Front camera is unavailable.',
          recoverable: false,
        });
      }
    }

    prepareCamera().catch((error: unknown) => {
      props.onError?.({
        code: 'cameraUnavailable',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to prepare camera permission and device state.',
        recoverable: true,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [Camera, props]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        const nextIsActive = nextState === 'active';

        setIsCameraActive(nextIsActive);

        if (nextIsActive) {
          ignoreNativeCommand(
            NativeFaceBiometricsModule.resumeSession(sessionId)
          );
        } else {
          ignoreNativeCommand(
            NativeFaceBiometricsModule.pauseSession(sessionId)
          );
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [sessionId]);

  useEffect(() => {
    return subscribeToFaceBiometricsEvents(
      (event: NativeFaceBiometricsEvent) => {
        if (event.sessionId !== sessionId) {
          return;
        }

        switch (event.type) {
          case 'progress':
            props.onProgress?.(event.payload);
            return;
          case 'qualityChanged':
            props.onQualityChanged?.(event.payload);
            return;
          case 'poseChanged':
            props.onPoseChanged?.(event.payload.pose, event.payload.progress);
            return;
          case 'enrollmentComplete':
            if (props.mode === 'enroll') {
              props.onEnrollmentComplete?.(event.payload);
            }
            return;
          case 'recognitionComplete':
            if (props.mode === 'recognize') {
              props.onRecognitionComplete?.(event.payload);
            }
            return;
          case 'error':
            props.onError?.(event.payload);
            return;
        }
      }
    );
  }, [props, sessionId]);

  useEffect(() => {
    if (
      validationError != null ||
      permissionStatus !== 'granted' ||
      frontDevice == null
    ) {
      return;
    }

    const config = buildSessionConfig(sessionId, props);

    ignoreNativeCommand(NativeFaceBiometricsModule.startSession(config));

    return () => {
      ignoreNativeCommand(NativeFaceBiometricsModule.disposeSession(sessionId));
    };
  }, [frontDevice, permissionStatus, props, sessionId, validationError]);

  if (validationError != null) {
    return null;
  }

  if (Camera == null) {
    return (
      <View style={[styles.centered, props.style]}>
        <Text>Camera unavailable</Text>
        {props.children}
      </View>
    );
  }

  if (permissionStatus !== 'granted') {
    return (
      <View style={[styles.centered, props.style]}>
        <Text>Camera permission required</Text>
        {props.children}
      </View>
    );
  }

  if (frontDevice == null) {
    return (
      <View style={[styles.centered, props.style]}>
        <Text>Front camera unavailable</Text>
        {props.children}
      </View>
    );
  }

  return (
    <View style={[styles.container, props.style]}>
      {createElement(Camera, {
        style: styles.preview,
        device: frontDevice,
        isActive: isCameraActive,
        audio: false,
        photo: false,
        video: false,
      })}
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function ignoreNativeCommand(command: Promise<void>) {
  command.catch(() => {});
}
