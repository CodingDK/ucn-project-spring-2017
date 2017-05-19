export class ResponseError extends Error {
  private parentError: any;
  public code: number;
  
  private constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ResponseError.prototype);
  }

  static makeNew(error: any, message: string, code: number = 0) : ResponseError {
    let obj = new ResponseError(message);
    obj.parentError = error;
    obj.code = code;
    return obj;
  }

  getParentError(): any {
    return this.parentError;
  }
}