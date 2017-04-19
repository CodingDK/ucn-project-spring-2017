import { Schema, SchemaDefinition } from 'mongoose';

export function getNewSchemaWithDefaultOptions(schemaDefinition: SchemaDefinition) : Schema {
  return new Schema(schemaDefinition, {
      toObject: {
        transform: function (doc: any, ret: any) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
      }
  }); 
}