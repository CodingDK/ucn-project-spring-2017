import { Document, model, Schema } from 'mongoose';
import { getNewSchemaWithDefaultOptions} from '../helpers';


const options = { discriminatorKey: 'objType' };

/**
 * Model class for a dbUser object
 */
export class DbUser {
  name: string;
  email: string;
  password: string;
  googleId: string;
}

// no necessary to export the schema (keep it private to the module)
const schema = getNewSchemaWithDefaultOptions({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  googleId: { type: String }
}, options);

/**
 * Interface/Class for an user
 */
export interface UserDocument extends DbUser, Document { }

/**
 * Mongoose collection for Users
 */
export const Users = model<UserDocument>('User', schema);


export class DbTeacher extends DbUser {
  schoolClasses: string[];
  roles: string[];
}

const teacherSchema = getNewSchemaWithDefaultOptions({
  schoolClasses: [{
    type: String
  }],
  roles: [{
    type: String
  }]  
}, options);

export interface TeacherDocument extends UserDocument { }

export const Teachers = Users.discriminator<TeacherDocument>('Teacher', teacherSchema);


export class DbStudent {//extends DbUser {
  schoolClass: string;
}

const studentSchema = new Schema({
  schoolClass: { type: String, required: true }
}, options);

export interface StudentDocument extends UserDocument {
  schoolClass: string;
}

export const Students = Users.discriminator<StudentDocument>('Students', studentSchema);
