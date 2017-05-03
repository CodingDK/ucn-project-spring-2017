export class DbError extends Error {
  private parentError: any;

  private constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DbError.prototype);
  }

  static makeNew(error: any, message: string): DbError {
    let obj = new DbError(message);
    obj.parentError = error;
    return obj;
  }

  getParentError(): any {
    return this.parentError;
  }
}