import { Document, model, Schema } from 'mongoose';
import { getNewSchemaWithDefaultOptions } from '../helpers';
import { GoogleTokens } from '../../../shared/models/googleTokens';

/**
 * Model class for a dbUser object
 */
export class DbUser {
  name: string;
  imageUrl: string;
  email: string;
  password: string;
  googleId: string;
  googleTokens: GoogleTokens;
  schoolClasses: string[];
  roles: string[];
}

const googleTokensSchema = getNewSchemaWithDefaultOptions({
  access_token: { type: String },
  expiry_date: { type: Number },
  refresh_token: { type: String },
},
{ _id: false });

// no necessary to export the schema (keep it private to the module)
const schema = getNewSchemaWithDefaultOptions({
  name: { type: String, required: true },
  imageUrl: { type: String },
  email: { type: String },
  password: { type: String },
  googleId: { type: String, required: true },
  googleTokens: googleTokensSchema,
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