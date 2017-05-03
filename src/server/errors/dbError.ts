export class DbError extends Error {
  private parentError: Error;

  constructor(error: Error, message: string) {
    super(message);
    this.parentError;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbError.prototype);
  }

  getParentError(): Error {
    return this.parentError;
  }
}