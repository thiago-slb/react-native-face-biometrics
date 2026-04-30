import {
  DEFAULT_FACE_RECOGNITION_THRESHOLD,
  type FaceBiometricsCameraProps,
  type FaceBiometricsError,
  type FacePose,
} from '../types';
import { isFaceEmbedding } from './validateEmbedding';

const FACE_POSES = new Set<FacePose>(['center', 'left', 'right', 'up', 'down']);

export function validateFaceBiometricsCameraProps(
  props: FaceBiometricsCameraProps
): FaceBiometricsError | null {
  if (props.mode !== 'enroll' && props.mode !== 'recognize') {
    return createConfigError('Mode must be "enroll" or "recognize".');
  }

  if (props.mode === 'recognize' && !isFaceEmbedding(props.knownEmbedding)) {
    return createConfigError(
      'Recognition mode requires knownEmbedding with exactly 128 finite numbers.'
    );
  }

  const invalidPose = props.requiredPoses?.find(
    (pose) => !FACE_POSES.has(pose)
  );

  if (invalidPose != null) {
    return createConfigError(`Unsupported required pose: ${invalidPose}.`);
  }

  const threshold =
    props.mode === 'recognize'
      ? (props.threshold ?? DEFAULT_FACE_RECOGNITION_THRESHOLD)
      : undefined;

  if (threshold != null && (!Number.isFinite(threshold) || threshold < 0)) {
    return createConfigError(
      'Recognition threshold must be a finite number greater than or equal to 0.'
    );
  }

  const numericFields = [
    ['minBrightness', props.minBrightness],
    ['minSharpness', props.minSharpness],
    ['maxBlur', props.maxBlur],
    ['stabilityMs', props.stabilityMs],
  ] as const;

  const invalidNumericField = numericFields.find(
    ([, value]) => value != null && (!Number.isFinite(value) || value < 0)
  );

  if (invalidNumericField != null) {
    return createConfigError(
      `${invalidNumericField[0]} must be a finite number greater than or equal to 0.`
    );
  }

  return null;
}

function createConfigError(message: string): FaceBiometricsError {
  return {
    code: 'invalidConfiguration',
    message,
    recoverable: false,
  };
}
