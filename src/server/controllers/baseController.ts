import { ResponseError } from '../errors/responseError';
import { DbError } from '../errors/dbError';

export abstract class BaseController {

  protected errorHandler(err: any) {
    if (err instanceof ResponseError) {
      throw err;
    } else if (err instanceof DbError) {
      throw ResponseError.makeNew(err, err.message);
    } else {
      throw ResponseError.makeNew(err, "an unknown error happened");
    }
  }
}