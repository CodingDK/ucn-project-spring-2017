import { Document, model } from 'mongoose';
import { getNewSchemaWithDefaultOptions} from '../helpers';

/**
 * Model class for a dbUser object
 */
export class DbUser {
  email: string;
  password: string;
  googleId: string;
}

// no necessary to export the schema (keep it private to the module)
const schema = getNewSchemaWithDefaultOptions({
  email: { type: String, required: true },
  password: { type: String, required: true },
  googleId: { type: String }
});
// register each method at schema
//schema.method('validPassword', User.prototype.validPassword);

/**
 * Interface/Class for an user
 */
export interface UserDocument extends DbUser, Document { }

/**
 * Mongoose collection for Users
 */
export const Users = model<UserDocument>('User', schema);
