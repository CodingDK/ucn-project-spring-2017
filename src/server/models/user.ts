//import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import { Document, Schema, model } from 'mongoose';

/**
 * Model class for an user object
 */
export class User {
  email: string;
  password: string;

  constructor(data: { email: string, password: string }) {
    this.email = data.email
    this.password = data.password
  }

  public static createNew(email: string, password: string) {
    const hashed = this.generateHash(password);
    return new User({email, password: hashed});
  }

  private static generateHash(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  public validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
// no necessary to export the schema (keep it private to the module)
const schema = new Schema({
  email: {type:String, required: true},
  password: {type:String, required: true}
});
// register each method at schema
schema.method('validPassword', User.prototype.validPassword);

/**
 * Interface/Class for an user
 */
export interface UserDocument extends User, Document { }

/**
 * Mongoose collection for Users
 */
export const Users = model<UserDocument>('User', schema);
