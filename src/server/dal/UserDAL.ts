import { User, Student } from '../../shared/models/user';
import { DbUser, UserDocument, Users } from './models/dbUser';

/**
 * Class for handling Users in database
 */
export class UserDal {

  /**
   * Method to find Students by School Class name
   */
  public findStudentsBySchoolClassName(name: string): Promise<Student[]> {
    return new Promise<Student[]>((resolve, reject) => {
      Users.find({
        schoolClass: name,
        roles: "student"
      }, (err, objs: UserDocument[]) => {
        if (err) {
          reject(err);
        }
        let retList = new Array<Student>();
        if (objs != null) {
          objs.forEach((value: UserDocument) => {
            retList.push(value.toObject() as Student);
          });
        }
        resolve(retList);
      });
    }); 
  } 

  /**
   * Method for finding an user by email
   * @param email the email to look for
   */
  public findByEmail(email: string) : Promise<User> {
    return new Promise<User>((resolve, reject) => {
      Users.findOne({'email': email}, (err, userDoc: UserDocument) => {
        if (err) {
          //TODO maybe better error handling
          reject(err);
        }
        if (userDoc != null) {
          resolve(userDoc.toObject() as User);
        }
        resolve(undefined);
        /*
        let test = userDoc.toObject() as User;
        console.log("### userDal start ###");
        console.log("userDoc", userDoc);
        console.log("id", userDoc._id);
        console.log("id type", typeof userDoc._id);
        console.log("test", test);
        console.log("id", test.id);
        console.log("id type", typeof test.id);
        console.log("### userDal end ###");
        resolve(userDoc.toObject() as User);*/
      });
    });
  }

  /**
   * Method for finding an user by id
   * @param id the id of the user
   */
  public findById(id : string) : Promise<User> {
    return new Promise<User>((resolve, reject) => {
      Users.findById(id, (err, userDoc: UserDocument) => {
        if (err) {
          //TODO maybe better error handling
          reject(err);
          //throw new DbError(JSON.stringify(err));
        }
        if (userDoc != null) {
          resolve(userDoc.toObject() as User);
        }
        resolve(undefined);
      });
    });
  }

  /**
   * Method for finding an user by googleId
   * @param googleId the googleId of the user
   */
  public findByGoogleId(googleId : string) : Promise<User> {
    return new Promise<User>((resolve, reject) => {
      Users.findOne({ googleId }, (err, userDoc: UserDocument) => {
        if (err) {
          //TODO maybe better error handling
          reject(err);
        }
        if (userDoc != null) {
          resolve(userDoc.toObject() as User);
        }
        resolve(undefined);
      });
    });
  }

  /**
   * Method for creating a new user
   * @param email the email of the user
   * @param hashedPassword the password for the user
   */
  public createUser(newUser: User) : Promise<User> {
    return new Promise<User>((resolve, reject) => {
      Users.create(newUser, (err: any, createdUser: UserDocument) => {
        if (err) {
          reject(err);
        }
        if (createdUser != null) {
          resolve(createdUser.toObject() as User);
        }
        resolve(undefined);
      })
    });
  }
}
