/**
 * Domain Errors
 * -------------
 * Regla: el dominio NO conoce HTTP.
 * Los casos de uso/services tiran DomainError (y subclases) con un `code` estable.
 * El middleware de errores es el único responsable de traducir a HTTP.
 */

export class DomainError extends Error {
  /**
   * @param {string} code - Código estable (para tests/cliente), ej: "COURSE_NOT_FOUND"
   * @param {string} message - Mensaje humano
   * @param {object} [details] - Información adicional (no PII) para debugging
   */
  constructor(code, message, details = undefined) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends DomainError {
  constructor(code, message, details) {
    super(code, message, details);
  }
}

export class ConflictError extends DomainError {
  constructor(code, message, details) {
    super(code, message, details);
  }
}

export class ValidationError extends DomainError {
  constructor(code, message, details) {
    super(code, message, details);
  }
}

export class AuthError extends DomainError {
  constructor(code, message, details) {
    super(code, message, details);
  }
}

export class ForbiddenError extends DomainError {
  constructor(code, message, details) {
    super(code, message, details);
  }
}

