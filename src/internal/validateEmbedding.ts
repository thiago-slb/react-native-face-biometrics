import {
  FACE_EMBEDDING_DIMENSIONS,
  type FaceBiometricsError,
  type FaceEmbedding,
} from '../types';

export function isFaceEmbedding(value: unknown): value is FaceEmbedding {
  return (
    Array.isArray(value) &&
    value.length === FACE_EMBEDDING_DIMENSIONS &&
    value.every((item) => typeof item === 'number' && Number.isFinite(item))
  );
}

export function createInvalidEmbeddingError(
  label: string
): FaceBiometricsError {
  return {
    code: 'invalidEmbedding',
    message: `${label} must be exactly ${FACE_EMBEDDING_DIMENSIONS} finite numbers.`,
    recoverable: false,
  };
}

export function assertFaceEmbedding(
  value: unknown,
  label = 'Face embedding'
): asserts value is FaceEmbedding {
  if (!isFaceEmbedding(value)) {
    throw new TypeError(createInvalidEmbeddingError(label).message);
  }
}
