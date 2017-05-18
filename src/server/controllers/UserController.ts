import * as bcrypt from 'bcrypt-nodejs';

import { User, Student, GoogleTokens } from '../../shared/models/user';
import { UserDal } from '../dal/userDAL';

import { BaseController } from './baseController';

/**
 * Controller for handling Users
 */
export class UserController extends BaseController {
  private dal: UserDal = new UserDal();

  /**
   * This Method will create a new user in database or update if an user with the googleId already exists in the database
   * @returns the created user or the updated user
   */
  public createOrUpdateWithGoogleInfo(googleId: string, name: string, imageUrl: string, googleTokens: GoogleTokens, schoolClasses: string[], roles: string[]) : Promise<User> {
    return this.dal.createOrUpdateWithGoogleInfo(googleId, name, imageUrl, googleTokens, schoolClasses, roles);
  }

  /**
   * Method to ge all users
   * @param roles the roles to get, or just undefined to get all users
   */
  public getAll(user: any, roles?: string[]) : Promise<User[]> {
    return this.dal.getAll(user, roles);
  }

  /**
   * Method to find Students by School Class name
   */
  public findStudentsBySchoolClassNames(user: any, names: string[]): Promise<Student[]> {
    return this.dal.findStudentsBySchoolClassNames(user, names);
  } 

  /**
   * Method to check ids exists in the database
   */
  public checkIdsExist(user: any, ids: string[], roles?: string[]): Promise<boolean> {
    return this.dal.checkIdsExist(user, ids, roles);
  } 

  /**
   * Method for finding an user by id
   * @param id the id of the user
   */
  public findById(user: any, id: string): Promise<User> {
    return this.dal.findById(user, id);
  }

  /**
   * Method for finding an user by email
   * @param email the email to look for
   */
  //public findByEmail(email: string): Promise<User> {
  //  return this.dal.findByEmail(email);
  //}

  /**
   * Method for finding an user by googleId
   * @param googleId the googleId of the user
   */
  public findByGoogleId(user: any, googleId: string): Promise<User> {
    return this.dal.findByGoogleId(user, googleId);
  }

  /**
   * Method for creating a new user
   * @param email the email of the user
   * @param password the password for the user
   */
  //public createUser(email: string, password: string): Promise<User> {
  //  const newUser = new User();
  //  newUser.email = email;
  //  newUser.password = this.generateHash(password);

  //  return this.dal.createUser(newUser);
  //}

  private generateHash(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  public validPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
