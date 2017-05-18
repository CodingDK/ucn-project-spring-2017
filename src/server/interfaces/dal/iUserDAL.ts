//import { IBaseDAL } from './iBaseDAL';
import { User, GoogleTokens } from '../../models/user';

export interface IUserDAL {
  getAll(user: any, roles?: string[]): Promise<User[]>;

  findById(user: any, id: string): Promise<User>;
  
  findStudentsBySchoolClassNames(user: any, names: string[]): Promise<User[]>;
  
  findByGoogleId(user: any, googleId: string): Promise<User>;

  checkIdsExist(user: any, ids: string[], roles?: string[]): Promise<boolean>;
  
  createOrUpdateWithGoogleInfo(googleId: string, name: string,
    imageUrl: string, googleTokens: GoogleTokens,
    schoolClasses: string[], roles: string[]): Promise<User>;
}