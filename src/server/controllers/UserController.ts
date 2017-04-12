import {UserDocument} from '../models/user';
import {UserDal} from '../dal/userDAL';

/**
 * Controller for handling Users
 */
export class UserController {
  private dal: UserDal = new UserDal();

  /**
   * Method for finding a user by id
   * @param id the id of the user
   */
  public findById(id : string) : Promise<UserDocument> {
    return this.dal.findById(id);
  }

  /**
   * Method for finding a user by email
   * @param email the email to look for
   */
  public findByEmail(email : string) : Promise<UserDocument> {
    return this.dal.findByEmail(email);
  }

  /**
   * Method for creating a new user
   * @param email the email of the user
   * @param password the password for the user
   */
  public createUser(email:string, password: string) : Promise<UserDocument> {
    return this.dal.createUser(email, password);
  }
}
