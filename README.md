# react-native-face-biometrics

Production-grade React Native face biometrics plugin planned around `react-native-vision-camera`, native frame processing, guided enrollment, recognition, and 128D face encodings.

This package is under active planning and development. The checklist below is the implementation roadmap and should be updated as each item lands.

## Roadmap

### Core Architecture

- [ ] Define clean architecture boundaries for JS API, React component, hooks, native bridge, frame processor, face detection, quality analysis, ML inference, comparison, example app, tests, docs, and release tooling.
- [ ] Keep the JavaScript layer small and focused on types, props, callbacks, hooks, and state orchestration.
- [ ] Keep all frame analysis in native Android and iOS code.
- [ ] Prevent raw frames, images, bitmaps, pixel buffers, face crops, or temporary image paths from crossing the JS bridge.
- [ ] Emit only small serializable events and final result payloads to JavaScript.
- [ ] Define module boundaries for Android Kotlin and iOS Swift implementations.

### Public API

- [ ] Export `FaceBiometricsCamera`.
- [ ] Export `useFaceEnrollment`.
- [ ] Export `useFaceRecognition`.
- [ ] Export `compareFaceEmbeddings`.
- [ ] Define `FaceEmbedding`.
- [ ] Define `FacePose`.
- [ ] Define `FaceQualityReport`.
- [ ] Define `FaceEnrollmentResult`.
- [ ] Define `FaceRecognitionResult`.
- [ ] Define `FaceBiometricsCameraProps`.
- [ ] Support `mode: "enroll" | "recognize"`.
- [ ] Support `knownEmbedding?: number[]`.
- [ ] Support `requiredPoses?: FacePose[]`.
- [ ] Support `minBrightness?: number`.
- [ ] Support `minSharpness?: number`.
- [ ] Support `maxBlur?: number`.
- [ ] Support `stabilityMs?: number`.
- [ ] Support `threshold?: number`.
- [ ] Support `onProgress`.
- [ ] Support `onQualityChanged`.
- [ ] Support `onPoseChanged`.
- [ ] Support `onEnrollmentComplete`.
- [ ] Support `onRecognitionComplete`.
- [ ] Support `onError`.
- [ ] Add strict runtime validation for 128-dimensional finite embeddings.
- [ ] Add TypeScript type tests for the public API.

### Camera Component

- [ ] Build a reusable `FaceBiometricsCamera` component.
- [ ] Use `react-native-vision-camera` internally.
- [ ] Render a front-facing camera preview.
- [ ] Handle camera permission states.
- [ ] Handle loading, denied, blocked, restricted, and unavailable permission states.
- [ ] Validate front camera availability before starting a session.
- [ ] Handle camera lifecycle on mount and unmount.
- [ ] Pause native frame processing when the app backgrounds.
- [ ] Resume or restart safely when the app foregrounds.
- [ ] Handle camera interruptions such as app switching, phone calls, OS camera revocation, and permission changes.
- [ ] Normalize device orientation and front-camera mirroring.
- [ ] Support Expo dev builds.
- [ ] Document that Expo Go is not supported.

### Native Bridge And Contracts

- [ ] Define versioned JS-to-native command contracts.
- [ ] Define versioned native-to-JS event contracts.
- [ ] Define stable event schemas for progress, quality changes, pose changes, completion, warnings, and errors.
- [ ] Define stable error codes.
- [ ] Define stable warning codes.
- [ ] Add `embeddingSchemaVersion`.
- [ ] Add `modelId`.
- [ ] Add `modelVersion`.
- [ ] Add `preprocessingVersion`.
- [ ] Add `distanceMetric`.
- [ ] Add contract compatibility tests.
- [ ] Throttle native events to avoid bridge flooding.
- [ ] Ensure terminal events always bypass throttling.

### Android Native Implementation

- [ ] Implement native frame processing in Kotlin.
- [ ] Register the VisionCamera frame processor plugin.
- [ ] Build Android session lifecycle classes.
- [ ] Build Android enrollment session.
- [ ] Build Android recognition session.
- [ ] Add Android face detector integration.
- [ ] Add Android quality analyzer.
- [ ] Add Android pose guidance state machine.
- [ ] Add Android best-frame selector.
- [ ] Add Android embedding model loader.
- [ ] Add Android TFLite or equivalent inference runtime.
- [ ] Add Android embedding comparison logic.
- [ ] Add Android device capability checks.
- [ ] Add Android memory cleanup for frames, tensors, and buffers.
- [ ] Add Android native unit tests where possible.
- [ ] Add Android instrumentation tests where practical.

### iOS Native Implementation

- [ ] Implement native frame processing in Swift.
- [ ] Register the VisionCamera frame processor plugin.
- [ ] Build iOS session lifecycle classes.
- [ ] Build iOS enrollment session.
- [ ] Build iOS recognition session.
- [ ] Add iOS face detection using Vision or an equivalent native detector.
- [ ] Add iOS quality analyzer.
- [ ] Add iOS pose guidance state machine.
- [ ] Add iOS best-frame selector.
- [ ] Add iOS embedding model loader.
- [ ] Add iOS Core ML, TFLite, or equivalent inference runtime.
- [ ] Add iOS embedding comparison logic.
- [ ] Add iOS device capability checks.
- [ ] Add iOS memory cleanup for frames, tensors, and buffers.
- [ ] Add iOS native tests where possible.

### Native Frame Processing

- [ ] Process frames only in native code.
- [ ] Sample frames instead of analyzing every frame.
- [ ] Add configurable target analysis FPS.
- [ ] Skip frames while native analysis is busy.
- [ ] Keep only bounded native work queues.
- [ ] Avoid unbounded frame backlog.
- [ ] Avoid unnecessary image copies.
- [ ] Reuse buffers where safe.
- [ ] Run face detection off the UI thread.
- [ ] Run ML inference off the UI thread.
- [ ] Release temporary native frame data after completion, cancellation, or error.
- [ ] Measure dropped frames.
- [ ] Measure preview FPS impact.

### Face Detection

- [ ] Detect exactly one face before accepting a frame.
- [ ] Reject frames with no face.
- [ ] Reject frames with multiple faces.
- [ ] Extract face bounds.
- [ ] Extract landmarks where available.
- [ ] Extract yaw, pitch, and roll where available.
- [ ] Normalize detector outputs across Android and iOS.
- [ ] Handle rotated devices consistently.
- [ ] Handle front-camera mirroring consistently.

### Quality Analysis

- [ ] Validate brightness.
- [ ] Validate sharpness.
- [ ] Validate blur.
- [ ] Validate face size.
- [ ] Validate face centeredness.
- [ ] Validate pose angle.
- [ ] Validate distance from camera.
- [ ] Validate stability window.
- [ ] Select best frames.
- [ ] Return quality reports with normalized metrics.
- [ ] Reject poor lighting.
- [ ] Reject camera obstruction.
- [ ] Reject fast movement.
- [ ] Reject face too close.
- [ ] Reject face too far.
- [ ] Return selected best-frame metadata without image data.

### Guided Poses And Movement

- [ ] Support `center`.
- [ ] Support `left`.
- [ ] Support `right`.
- [ ] Support `up`.
- [ ] Support `down`.
- [ ] Implement native guided pose validation.
- [ ] Require stable pose before capture.
- [ ] Track captured poses.
- [ ] Emit pose progress events.
- [ ] Use guided movement as liveness-style validation for recognition.
- [ ] Document that guided movement is not certified liveness or presentation-attack detection.

### Enrollment

- [ ] Support face registration/enrollment mode.
- [ ] Capture multiple valid frames across required guided poses.
- [ ] Select the best frame metadata per pose.
- [ ] Generate a final native embedding.
- [ ] Return a 128-dimensional normalized number array.
- [ ] Return quality report.
- [ ] Return captured poses.
- [ ] Return selected best-frame metadata.
- [ ] Avoid automatic biometric storage.
- [ ] Leave storage fully caller-controlled.

### Recognition

- [ ] Support face recognition/verification mode.
- [ ] Validate a caller-provided known embedding.
- [ ] Require guided movement before comparison.
- [ ] Generate a native recognition embedding.
- [ ] Compare embeddings using Euclidean distance.
- [ ] Apply configurable threshold.
- [ ] Return `match`.
- [ ] Return `distance`.
- [ ] Return `threshold`.
- [ ] Return `embedding`.
- [ ] Return quality report.
- [ ] Return captured poses.
- [ ] Avoid automatic biometric storage.

### Embeddings And ML Model

- [ ] Select an open-source-compatible face embedding model.
- [ ] Validate redistribution license.
- [ ] Produce ageitgey/face_recognition-style output.
- [ ] Return 128-dimensional embeddings.
- [ ] Normalize embeddings.
- [ ] Version the embedding schema.
- [ ] Version the model.
- [ ] Version preprocessing.
- [ ] Align preprocessing across Android and iOS.
- [ ] Add face alignment.
- [ ] Add model loading.
- [ ] Add model caching.
- [ ] Add model warm-up.
- [ ] Handle model load failures gracefully.
- [ ] Handle inference failures gracefully.
- [ ] Add threshold calibration tasks.
- [ ] Evaluate false accept behavior.
- [ ] Evaluate false reject behavior.
- [ ] Document that thresholds are model-specific and application-specific.

### Comparison Utility

- [ ] Implement `compareFaceEmbeddings`.
- [ ] Validate both embeddings are 128 finite numbers.
- [ ] Compute Euclidean distance.
- [ ] Apply threshold.
- [ ] Return match, distance, and threshold.
- [ ] Add unit tests for exact match, mismatch, threshold boundary, invalid dimensions, and invalid values.

### Performance

- [ ] Define frame sampling strategy.
- [ ] Define backpressure strategy.
- [ ] Define event throttling strategy.
- [ ] Cache loaded models.
- [ ] Warm up ML inference.
- [ ] Reuse native buffers where safe.
- [ ] Avoid unnecessary image copies.
- [ ] Run expensive work off the UI thread.
- [ ] Measure camera preview FPS.
- [ ] Measure analysis FPS.
- [ ] Measure detector latency.
- [ ] Measure embedding latency.
- [ ] Measure dropped frames.
- [ ] Measure memory usage.
- [ ] Profile Android with Android Studio Profiler, Perfetto, or Systrace.
- [ ] Profile iOS with Instruments Time Profiler, Allocations, and Energy Log.
- [ ] Validate low-end Android behavior.
- [ ] Validate recent iPhone behavior.

### Edge Cases

- [ ] Handle no face.
- [ ] Handle multiple faces.
- [ ] Handle poor lighting.
- [ ] Handle camera obstruction.
- [ ] Handle fast movement.
- [ ] Handle face too close.
- [ ] Handle face too far.
- [ ] Handle rotated device.
- [ ] Handle low-end Android devices.
- [ ] Handle app interruption.
- [ ] Handle permission denied.
- [ ] Handle camera unavailable.
- [ ] Handle model unavailable.
- [ ] Handle inference timeout.
- [ ] Handle session cancellation.
- [ ] Handle session reset.

### Security And Privacy

- [ ] Treat face embeddings as sensitive biometric data.
- [ ] Do not store biometric data automatically.
- [ ] Keep storage caller-controlled.
- [ ] Do not log embeddings.
- [ ] Do not log raw frame data.
- [ ] Do not send image frames over the bridge.
- [ ] Clear temporary native references after use.
- [ ] Document consent requirements.
- [ ] Document retention and deletion responsibilities.
- [ ] Document encryption-at-rest recommendations.
- [ ] Document transport security recommendations if embeddings leave the device.
- [ ] Add threat model notes.
- [ ] Add biometric data handling policy.
- [ ] Add privacy and security disclaimers.
- [ ] Document that this is not certified biometric authentication.
- [ ] Document that this is not a replacement for platform Face ID, Touch ID, Android BiometricPrompt, or certified presentation-attack detection.
- [ ] Plan optional encrypted storage as a future extension only.

### Example App

- [ ] Add enrollment screen.
- [ ] Add recognition screen.
- [ ] Add pose guidance overlay.
- [ ] Add quality meter.
- [ ] Add caller-controlled embedding storage example.
- [ ] Add explicit user action before storing an embedding.
- [ ] Add recognition match flow.
- [ ] Add recognition mismatch flow.
- [ ] Add permission denied flow.
- [ ] Add no-face flow.
- [ ] Add multiple-faces flow.
- [ ] Add poor-lighting flow.
- [ ] Add face-too-close flow.
- [ ] Add face-too-far flow.
- [ ] Add app-interruption flow.
- [ ] Add diagnostics screen for non-sensitive performance metrics.

### Testing

- [ ] Add TypeScript unit tests.
- [ ] Add TypeScript type tests.
- [ ] Add public API tests.
- [ ] Add embedding comparison tests.
- [ ] Add prop validation tests.
- [ ] Add event schema tests.
- [ ] Add native contract compatibility tests.
- [ ] Add Android quality analyzer tests.
- [ ] Add Android pose state machine tests.
- [ ] Add Android model lifecycle tests where possible.
- [ ] Add iOS quality analyzer tests.
- [ ] Add iOS pose state machine tests.
- [ ] Add iOS model lifecycle tests where possible.
- [ ] Add example app smoke tests.
- [ ] Add manual physical-device validation checklist.

### Documentation

- [ ] Write installation docs.
- [ ] Write Expo dev build setup docs.
- [ ] Document that Expo Go is unsupported.
- [ ] Write API docs.
- [ ] Write enrollment docs.
- [ ] Write recognition docs.
- [ ] Write quality analysis docs.
- [ ] Write guided poses docs.
- [ ] Write native architecture docs.
- [ ] Write model selection docs.
- [ ] Write threshold calibration docs.
- [ ] Write performance docs.
- [ ] Write security and privacy docs.
- [ ] Write troubleshooting docs.
- [ ] Write limitations docs.
- [ ] Write release checklist.

### CI And Release

- [ ] Add CI for linting.
- [ ] Add CI for formatting.
- [ ] Add CI for TypeScript.
- [ ] Add CI for unit tests.
- [ ] Add CI for type tests.
- [ ] Add CI for package build.
- [ ] Add CI for Android build.
- [ ] Add CI for iOS checks where practical.
- [ ] Add CI for example app smoke checks.
- [ ] Add release workflow.
- [ ] Add package contents validation.
- [ ] Add model license validation.
- [ ] Add API compatibility checks.
- [ ] Add native schema compatibility checks.
- [ ] Add publishing checklist.
- [ ] Add `SECURITY.md`.
- [ ] Add contribution guidelines.
- [ ] Add changelog process.

## Planned API Shape

```tsx
import {
  FaceBiometricsCamera,
  compareFaceEmbeddings,
  useFaceEnrollment,
  useFaceRecognition,
} from 'react-native-face-biometrics';
```

```tsx
<FaceBiometricsCamera
  mode="enroll"
  requiredPoses={['center', 'left', 'right', 'up', 'down']}
  minBrightness={0.35}
  minSharpness={0.55}
  maxBlur={0.45}
  stabilityMs={700}
  onProgress={(progress) => {}}
  onQualityChanged={(quality) => {}}
  onPoseChanged={(pose) => {}}
  onEnrollmentComplete={(result) => {}}
  onError={(error) => {}}
/>
```

```tsx
<FaceBiometricsCamera
  mode="recognize"
  knownEmbedding={knownEmbedding}
  threshold={0.6}
  requiredPoses={['center', 'left', 'center']}
  onRecognitionComplete={(result) => {}}
  onError={(error) => {}}
/>
```

## Non-Goals

- [ ] Do not process raw camera frames in JavaScript.
- [ ] Do not send raw frames over the bridge.
- [ ] Do not automatically store biometric data.
- [ ] Do not claim certified biometric authentication.
- [ ] Do not claim certified liveness detection.
- [ ] Do not support Expo Go.

## License

MIT
