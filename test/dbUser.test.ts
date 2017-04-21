import * as mocha from 'mocha';
import * as chai from 'chai';
import * as mongoose from 'mongoose';
const expect = chai.expect;

const dbURI = 'mongodb://localhost/ucn-spring-db';

import { Users, DbUser, UserDocument } from '../src/server/dal/models/dbUser';

//import app from '../src/server/server';

describe("Example spec for a model", () => {
  //beforeEach((done) => {
  //  console.log("start testing?");
  //  //console.log("value:", mongoose.connection.db);
  //  //if (mongoose.connection.db)  {
  //  //  console.log("hov?")
  //  //  return done();
  //  //};
  //  console.log("before connect");
  //  //mongoose.connect(dbURI, done);
  //});

  it("can save another", (done) => {
    mongoose.connect(dbURI);
    let arrUsers = [];
    let newUser = new DbUser();//new DbStudent();
    newUser.name = "test";
    newUser.email = "test";
    newUser.password = "test";
    //newUser.schoolClass = "test class";
    //console.log("dis's", Users.discriminators);
    //newUser.roles = ["admin", "teacher"];
    console.log("newUser before save", newUser);
    arrUsers.push(newUser);
    let newTeacher = new DbUser();
    newTeacher.name = "teacher";
    newTeacher.email = "teacher";
    newTeacher.password = "teacher";
    newTeacher.roles = ["Teacher"];
    newTeacher.schoolClasses = ["pwe0916", "other class"];

    console.log("newTeacher before save", newTeacher);
    arrUsers.push(newTeacher);
    let newStudent = new DbUser();
    newStudent.name = "student";
    newStudent.email = "student";
    newStudent.password = "student";
    newStudent.schoolClasses = ["pwe0916"];
    console.log("newStudent before save", newStudent);
    arrUsers.push(newStudent);
    Users.create(arrUsers, (err: any, createdUser: any) => {
      console.log("error", err);
      console.log("userDocument", createdUser);
    });
    mongoose.connection.close(done);
  });

  /*it("can be listed", function (done) {
    Dummy.find({}, function (err, models) {
      expect(err).to.not.exist;
      expect(models).to.have.length(2);

      done();
    });
  });
  */
  afterEach((done) => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      done();
      //process.exit(0);
    });
  });  
});
