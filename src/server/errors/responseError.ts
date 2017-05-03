export class ResponseError extends Error {
  private parentError: any;
  
  private constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ResponseError.prototype);
  }

  static makeNew(error: any, message: string) : ResponseError {
    let obj = new ResponseError(message);
    obj.parentError = error;
    return obj;
  }

  getParentError(): any {
    return this.parentError;
  }
}