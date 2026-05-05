/**
 * Maps thrown service/domain errors to HTTP status codes.
 * Shared by controllers (e.g. User, Product) for consistent API behavior.
 */
export function mapErrorToStatus(error: Error): number {
  const message = error.message.toLowerCase();

  if (message.includes("not found")) {
    return 404;
  }
  if (
    message.includes("already") ||
    message.includes("invalid") ||
    message.includes("required") ||
    message.includes("must be")
  ) {
    return 400;
  }
  if (message.includes("unauthorized")) {
    return 401;
  }
  if (message.includes("forbidden")) {
    return 403;
  }

  return 500;
}
