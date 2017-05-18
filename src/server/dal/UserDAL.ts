import { User, Student, Teacher, GoogleTokens } from '../../shared/models/user';
import { SchoolClass } from '../../shared/models/schoolClass';
import { DbUser, UserDocument, Users } from './models/dbUser';
import { DbError } from '../errors/dbError';

import { Types } from 'mongoose';
import { validateObjectId } from './helpers';

import { IUserDAL } from '../interfaces/dal/iUserDAL';
/**
 * Class for handling Users in database
 */
export class UserDal implements IUserDAL {

  /**
   * This Method will create a new user in database or update if an user with the googleId already exists in the database
   * @throws DbErrors throws if an error happen in creating or updating an user
   * @returns the created user or the updated user
   */
  public createOrUpdateWithGoogleInfo(googleId: string, name: string, imageUrl: string, googleTokens: GoogleTokens, schoolClasses: string[], roles: string[]): Promise<User> {
    let promise = this.updateWithGoogleInfo(googleId, name, imageUrl, googleTokens, schoolClasses, roles)
      .then((userDoc: UserDocument) => {
        if (!userDoc) {
          //User not found in db, so we need to create the user
          return this.createWithGoogleInfo(googleId, name, imageUrl, googleTokens, schoolClasses, roles)
            .then((userDoc: UserDocument) => {
              return userDoc;
            })
        } else {
          //User found in db just return it
          return userDoc;
        }
      })
      .then((userDoc: UserDocument) => {
        //convert userDocument to User object
        return this.getUserFromDocument(userDoc);
      }).catch((err: any) => {
        //rethrow error if it comes from creating else create a new DbError
        let retError = err;
        if (!(err instanceof DbError)) {
          retError = DbError.makeNew(err, `Error happen in createOrUpdateWithGoogleInfo with GoogleInfo googleId: ${googleId}`);
        }
        throw retError;
      });
    return promise;
  }

  /**
   * private method for find and update an user with google info
   */
  private updateWithGoogleInfo(googleId: string, name: string, imageUrl: string, googleTokens: GoogleTokens, schoolClasses: string[], roles: string[]): Promise<UserDocument> {
    return new Promise<UserDocument>((resolve, reject) => {
      let updateQuery: any = {
        $set: {
          name: name,
          imageUrl: imageUrl,
          'googleTokens.access_token': googleTokens.access_token,
          'googleTokens.expiry_date': googleTokens.expiry_date,
          schoolClasses: schoolClasses,
          roles: roles
        }
      };
      if (googleTokens.refresh_token) {
        updateQuery.$set['googleTokens.refresh_token'] = googleTokens.refresh_token;
      }
      Users.findOneAndUpdate({ googleId: googleId },
        updateQuery,
        { new: true }, (err: any, userDoc: UserDocument) => {
          if (err) {
            return reject(err);
          }
          return resolve(userDoc);
        });
    });
  }

  /**
   * private method for creating a new user with google info
   */
  private createWithGoogleInfo(googleId: string, name: string, imageUrl: string, googleTokens: GoogleTokens, schoolClasses: string[], roles: string[]): Promise<UserDocument> {
    const newUser = new DbUser();
    newUser.googleId = googleId;
    newUser.googleTokens = googleTokens;
    newUser.imageUrl = imageUrl;
    newUser.name = name;
    newUser.roles = roles;
    newUser.schoolClasses = schoolClasses;
    return Users.create(newUser)
      .catch((err: any) => {
        throw DbError.makeNew(err, `Error happen in creating new user with GoogleInfo googleId: ${googleId}`);
      });
  }


  private getUserFromDocument(userDoc: UserDocument): User {
    let newObj: User;
    let retObj: Student | Teacher;
    if (userDoc.roles.indexOf("student") == -1) { //check if the user is a teacher
      retObj = new Teacher();
      retObj.roles = userDoc.roles;
      retObj.schoolClasses = userDoc.schoolClasses.map((value => {
        return new SchoolClass(value);
      }));
    } else {
      retObj = new Student();
      retObj.schoolClass = new SchoolClass(userDoc.schoolClasses[0]);
    }
    retObj.email = userDoc.email;
    retObj.googleId = userDoc.googleId;
    retObj.googleTokens = userDoc.googleTokens;
    retObj.id = userDoc._id;
    retObj.imageUrl = userDoc.imageUrl;
    retObj.name = userDoc.name;
    retObj.password = userDoc.password;
    return retObj;
  }

  /**
   * private helper method for updating with google info
   * @returns will return a query for updating needed fields in database
   */
  private getUpdateQueryForGoogleInfo(name: string, imageUrl: string, googleTokens: GoogleTokens): any {
    let updateQuery: any = {
      $set: {
        name: name,
        imageUrl: imageUrl,
        'googleTokens.access_token': googleTokens.access_token,
        'googleTokens.expiry_date': googleTokens.expiry_date,
      }
    };
    if (googleTokens.refresh_token) {
      updateQuery.$set['googleTokens.refresh_token'] = "hej";
    }
    return updateQuery;
  }

  /**
   * Method to ge all users
   * @param roles the roles to get, or just undefined to get all users
   */
  public getAll(user: any, roles?: string[]): Promise<User[]> {
    let query: any = {};
    if (roles) {
      query.roles = { $in: roles };
    }
    return new Promise<User[]>((resolve, reject) => {
      Users.find(query, (err, objs: UserDocument[]) => {
        if (err) {
          return reject(DbError.makeNew(err, "A Database error happened"));
        }
        let retList = new Array<User>();
        if (objs != null) {
          objs.forEach((value: UserDocument) => {
            retList.push(value.toObject() as User);
          });
        }
        return resolve(retList);
      });
    });
  }

  /**
   * Method to find Students by SchoolClass names
   */
  public findStudentsBySchoolClassNames(user: any, names: string[]): Promise<Student[]> {
    return new Promise<Student[]>((resolve, reject) => {
      Users.find({
        roles: "student",
        schoolClasses: { $in: names }
      }, (err, objs: UserDocument[]) => {
        if (err) {
          return reject(DbError.makeNew(err, "A Database error happened"));
        }
        let retList = new Array<Student>();
        if (objs != null) {
          objs.forEach((value: UserDocument) => {
            retList.push(value.toObject() as Student);
          });
        }
        return resolve(retList);
      });
    });
  }

  /**
   * Method to check ids exists in the database
   */
  public checkIdsExist(user: any, ids: string[], roles?: string[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const validatePromises = ids.map((id) => { return validateObjectId(id) });

      Promise.all(validatePromises)
        .then((objectIds) => {
          let query: any = { _id: { $in: ids } };
          if (roles) {
            query.roles = { $in: roles } ;
          }
          Users.count(query, (err: any, dbCount: number) => {
            if (err) {
              return reject(DbError.makeNew(err, "A Database error happened"));
            }
            return resolve((ids.length === dbCount));
          });
        })
        .catch((err: any) => {
          return reject(DbError.makeNew(err, "Some of the Ids is not valid"));
        })
    });
  }

  /**
   * Method for finding an user by email
   * @param email the email to look for
   */
  //public findByEmail(email: string): Promise<User> {
  //  return new Promise<User>((resolve, reject) => {
  //    Users.findOne({ 'email': email }, (err, userDoc: UserDocument) => {
  //      if (err) {
  //        return reject(DbError.makeNew(err, "A Database error happened"));
  //      }
  //      if (userDoc != null) {
  //        return resolve(userDoc.toObject() as User);
  //      }
  //      return resolve(undefined);
  //      /*
  //      let test = userDoc.toObject() as User;
  //      console.log("### userDal start ###");
  //      console.log("userDoc", userDoc);
  //      console.log("id", userDoc._id);
  //      console.log("id type", typeof userDoc._id);
  //      console.log("test", test);
  //      console.log("id", test.id);
  //      console.log("id type", typeof test.id);
  //      console.log("### userDal end ###");
  //      resolve(userDoc.toObject() as User);*/
  //    });
  //  });
  //}

  /**
   * Method for finding an user by id
   * @param id the id of the user
   */
  public findById(user:any, id: string): Promise<User> {
    return validateObjectId(id)
      .then((objectId: Types.ObjectId) => {
        return new Promise<User>((resolve, reject) => {
          Users.findById(id, (err, userDoc: UserDocument) => {
            if (err) {
              return reject(DbError.makeNew(err, "A Database error happened"));
            }
            if (userDoc != null) {
              return resolve(userDoc.toObject() as User);
            }
            return resolve(undefined);
          });
        });
      });
  }

  /**
   * Method for finding an user by googleId
   * @param googleId the googleId of the user
   */
  public findByGoogleId(user: any, googleId: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      Users.findOne({ googleId }, (err, userDoc: UserDocument) => {
        if (err) {
          return reject(DbError.makeNew(err, "A Database error happened"));
        }
        if (userDoc != null) {
          return resolve(userDoc.toObject() as User);
        }
        return resolve(undefined);
      });
    });
  }

  /**
   * Method for creating a new user
   * @param email the email of the user
   * @param hashedPassword the password for the user
   */
  //public createUser(newUser: User): Promise<User> {
  //  return new Promise<User>((resolve, reject) => {
  //    Users.create(newUser, (err: any, createdUser: UserDocument) => {
  //      if (err) {
  //        return reject(DbError.makeNew(err, "A Database error happened"));
  //      }
  //      if (createdUser != null) {
  //        return resolve(createdUser.toObject() as User);
  //      }
  //      return resolve(undefined);
  //    })
  //  });
  //}
}
