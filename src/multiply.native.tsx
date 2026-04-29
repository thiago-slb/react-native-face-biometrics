import { NitroModules } from 'react-native-nitro-modules';
import type { FaceBiometrics } from './FaceBiometrics.nitro';

const FaceBiometricsHybridObject =
  NitroModules.createHybridObject<FaceBiometrics>('FaceBiometrics');

export function multiply(a: number, b: number): number {
  return FaceBiometricsHybridObject.multiply(a, b);
}
