import { Schema, SchemaDefinition } from 'mongoose';

export function getNewSchemaWithDefaultOptions(schemaDefinition: SchemaDefinition, options: any = null): Schema {
  let newOptions = {
    toObject: {
      transform: function (doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
    }
  };
  if (options != null) {
    newOptions = Object.assign(newOptions, options);
  }
  return new Schema(schemaDefinition, newOptions); 
}