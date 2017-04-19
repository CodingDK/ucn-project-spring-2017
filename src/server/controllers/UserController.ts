import * as bcrypt from 'bcrypt-nodejs';

import { User } from '../models/user';
import {UserDal} from '../dal/userDAL';

/**
 * Controller for handling Users
 */
export class UserController {
  private dal: UserDal = new UserDal();

  /**
   * Method for finding an user by id
   * @param id the id of the user
   */
  public findById(id: string): Promise<User> {
    return this.dal.findById(id);
  }

  /**
   * Method for finding an user by email
   * @param email the email to look for
   */
  public findByEmail(email: string): Promise<User> {
    return this.dal.findByEmail(email);
  }

  /**
   * Method for finding an user by googleId
   * @param googleId the googleId of the user
   */
  public findByGoogleId(googleId: string): Promise<User> {
    return this.dal.findByGoogleId(googleId);
  }

  /**
   * Method for creating a new user
   * @param email the email of the user
   * @param password the password for the user
   */
  public createUser(email: string, password: string): Promise<User> {
    const newUser = new User();
    newUser.email = email;
    newUser.password = this.generateHash(password);

    return this.dal.createUser(newUser);
  }

  private generateHash(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  public validPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
