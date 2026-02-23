type ErrorCode =
  | "bad_request"
  | "validation_error"
  | "rate_limited"
  | "configuration_error"
  | "unauthorized"
  | "not_found";

export class AppError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: string[];

  constructor(
    message: string,
    status: number,
    code: ErrorCode,
    details?: string[],
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Invalid request body") {
    super(message, 400, "bad_request");
    this.name = "BadRequestError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string[]) {
    super(message, 400, "validation_error", details);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Try again later.") {
    super(message, 429, "rate_limited");
    this.name = "RateLimitError";
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    super(message, 500, "configuration_error");
    this.name = "ConfigurationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized request.") {
    super(message, 401, "unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found.") {
    super(message, 404, "not_found");
    this.name = "NotFoundError";
  }
}
