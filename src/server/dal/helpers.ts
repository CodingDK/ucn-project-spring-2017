import { Schema, SchemaDefinition, Types } from 'mongoose';
import { ResponseError } from '../errors/responseError';

export function getNewSchemaWithDefaultOptions(schemaDefinition: SchemaDefinition, options: any = null): Schema {
  let newOptions = {
    toObject: {
      transform: function (doc: any, ret: any) {
        if (doc._id) {
          ret.id = doc._id.toString();
        }
        delete ret._id;
      }
    }
  };
  if (options != null) {
    newOptions = Object.assign(newOptions, options);
  }
  return new Schema(schemaDefinition, newOptions); 
}

/**
 * Validate an id and return a promise with an ObjectId object with the id
 * @param id the id to validate
 * @throws ResponseError throws if id is not valid
 */
export function validateObjectId(id: string | number) : Promise<Types.ObjectId> {
  return new Promise<Types.ObjectId>((resolve: any, reject: any) => {
    try {
      return resolve(Types.ObjectId(id));
    } catch (err) {
      return reject(ResponseError.makeNew(err, `Id is not valid: ${id}`));
    }
  })
}