export class DbError extends Error {
  private parentError: any;
  public code: number;

  private constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DbError.prototype);
  }

  static makeNew(error: any, message: string, code: number = 0): DbError {
    let obj = new DbError(message);
    obj.parentError = error;
    obj.code = code;
    return obj;
  }

  getParentError(): any {
    return this.parentError;
  }
}