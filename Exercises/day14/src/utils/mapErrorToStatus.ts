/**
 * Maps thrown service/domain errors to HTTP status codes.
 * Shared by every controller for consistent API behavior.
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
  if (
    message.includes("unauthorized") ||
    message.includes("invalid email or password")
  ) {
    return 401;
  }
  if (message.includes("forbidden") || message.includes("deactivated")) {
    return 403;
  }

  return 500;
}
