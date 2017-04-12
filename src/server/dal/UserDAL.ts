import {User, UserDocument, Users} from '../models/user';
/**
 * Class for handling Users in database
 */
export class UserDal {

  /**
   * Method for finding a user by email
   * @param email the email to look for
   */
  public findByEmail(email: string) : Promise<UserDocument> {
    return new Promise<UserDocument>((resolve, reject) => {
      Users.findOne({'email': email}, (err, userDoc) => {
        if (err) {
          //TODO maybe better error handling
          reject(err);
        }
        resolve(userDoc);
      });
    });
  }

  /**
   * Method for finding a user by id
   * @param id the id of the user
   */
  public findById(id : string) : Promise<UserDocument> {
    return new Promise<UserDocument>((resolve, reject) => {
      Users.findById(id, (err, userDoc) => {
        if (err) {
          //TODO maybe better error handling
          reject(err);
          //throw new DbError(JSON.stringify(err));
        }
        resolve(userDoc);
      });
    });
  }

  /**
   * Method for creating a new user
   * @param email the email of the user
   * @param password the password for the user
   */
  public createUser(email: string, password: string) : Promise<UserDocument> {
    return new Promise<UserDocument>((resolve, reject) => {
      const newUser = User.createNew(email, password);

      Users.create(newUser, (err: any, createdUser: UserDocument) => {
        if (err) {
          reject(err);
        }
        resolve(createdUser);
      })
    });
  }
}
