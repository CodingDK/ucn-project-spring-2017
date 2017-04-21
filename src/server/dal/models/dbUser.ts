import { Document, model, Schema } from 'mongoose';
import { getNewSchemaWithDefaultOptions} from '../helpers';

/**
 * Model class for a dbUser object
 */
export class DbUser {
  name: string;
  email: string;
  password: string;
  googleId: string;
  schoolClasses: string[];
  roles: string[];
}

// no necessary to export the schema (keep it private to the module)
const schema = getNewSchemaWithDefaultOptions({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  googleId: { type: String },
  schoolClasses: [{
    type: String
  }],
  roles: [{
    type: String
  }]  
});

/**
 * Interface/Class for an user
 */
export interface UserDocument extends DbUser, Document { }

/**
 * Mongoose collection for Users
 */
export const Users = model<UserDocument>('User', schema);