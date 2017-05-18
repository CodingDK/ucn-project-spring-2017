//import { IBaseDAL } from './iBaseDAL';
import { User, Student, GoogleTokens } from '../../../shared/models/user';

export interface IUserDAL {
  getAll(user: any): Promise<User[]>;

  findById(user: any, id: string): Promise<User>;
  
  findStudentsBySchoolClassNames(user: any, names: string[]): Promise<Student[]>;
  
  findByGoogleId(user: any, googleId: string): Promise<User>;

  checkIdsExist(user: any, ids: string[], roles?: string[]): Promise<boolean>;
  
  createOrUpdateWithGoogleInfo(googleId: string, name: string,
    imageUrl: string, googleTokens: GoogleTokens,
    schoolClasses: string[], roles: string[]): Promise<User>;
}