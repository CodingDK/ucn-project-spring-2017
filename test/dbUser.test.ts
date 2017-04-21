import * as mocha from 'mocha';
import * as chai from 'chai';
import * as mongoose from 'mongoose';
const expect = chai.expect;

const dbURI = 'mongodb://localhost/ucn-spring-db';

import { Users, DbTeacher, UserDocument, Teachers, TeacherDocument, DbStudent, StudentDocument } from '../src/server/dal/models/dbUser';

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
    let newUser: StudentDocument = <StudentDocument>{};//new DbStudent();
    newUser.name = "test";
    newUser.email = "test";
    newUser.password = "test";
    //newUser.schoolClass = "test class";
    //console.log("dis's", Users.discriminators);
    //newUser.roles = ["admin", "teacher"];
    console.log("newUser before save", newUser);
    arrUsers.push(newUser);
    let newTeacher = <TeacherDocument>{
      name: "teacher",
      email: "teacher",
      password: "teacher"
    }
    let newStudent = <any>{
      name: "student",
      email: "student",
      password: "student",
      schoolClass: "stuent class!",
      //objType: "Student" 
    }
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
