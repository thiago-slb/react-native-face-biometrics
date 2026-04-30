import {
  DEFAULT_FACE_RECOGNITION_THRESHOLD,
  type CompareFaceEmbeddingsResult,
  type FaceEmbedding,
} from '../types';
import { assertFaceEmbedding } from '../internal/validateEmbedding';

export function compareFaceEmbeddings(
  candidate: FaceEmbedding,
  known: FaceEmbedding,
  threshold = DEFAULT_FACE_RECOGNITION_THRESHOLD
): CompareFaceEmbeddingsResult {
  assertFaceEmbedding(candidate, 'Candidate embedding');
  assertFaceEmbedding(known, 'Known embedding');

  if (!Number.isFinite(threshold) || threshold < 0) {
    throw new TypeError(
      'Threshold must be a finite number greater than or equal to 0.'
    );
  }

  let squaredDistance = 0;

  for (let index = 0; index < candidate.length; index += 1) {
    const difference = candidate[index]! - known[index]!;
    squaredDistance += difference * difference;
  }

  const distance = Math.sqrt(squaredDistance);

  return {
    match: distance <= threshold,
    distance,
    threshold,
  };
}
