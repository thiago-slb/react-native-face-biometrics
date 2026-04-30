import { useEffect } from 'react';
import type { ReactElement } from 'react';

import type { FaceBiometricsCameraProps } from './types';

export function FaceBiometricsCamera(
  props: FaceBiometricsCameraProps
): ReactElement | null {
  const { onError } = props;

  useEffect(() => {
    onError?.({
      code: 'notImplemented',
      message:
        'FaceBiometricsCamera native camera implementation is tracked by TASK-002.',
      recoverable: false,
    });
  }, [onError]);

  return null;
}
