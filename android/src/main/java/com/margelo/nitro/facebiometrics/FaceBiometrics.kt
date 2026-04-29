package com.margelo.nitro.facebiometrics
  
import com.facebook.proguard.annotations.DoNotStrip

@DoNotStrip
class FaceBiometrics : HybridFaceBiometricsSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
