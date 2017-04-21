import * as mocha from 'mocha';
import * as chai from 'chai';
import * as mongoose from 'mongoose';
const expect = chai.expect;

const dbURI = 'mongodb://localhost/ucn-spring-db';

import { Lessons, LessonDocument, DbLesson, DbMeetUp } from '../src/server/dal/models/dbLesson';

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

    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    let newLesson = new DbLesson();
    newLesson.startTime = startDate;
    newLesson.endTime = endDate;
    newLesson.schoolClass = "pwe0916";
    newLesson.teachers = ["3"];

    let meetUp = new DbMeetUp();
    meetUp.student = "2";
    let meetUp2 = new DbMeetUp();
    meetUp2.student = "1";
    meetUp2.checkIn = startDate;
    meetUp2.topic = "hard work";
    meetUp2.checkOut = endDate;

    newLesson.meetUps = [meetUp, meetUp2];
    console.log("newLesson: ", newLesson);
    Lessons.create(newLesson, (err: any, createdLesson: any) => {
      console.log("error", err);
      console.log("createdLesson", createdLesson);
    });
    mongoose.connection.close(done);
  });
  
  /*
  it("can it query", (done) => {
    mongoose.connect(dbURI);
    Lessons.findOne({}, (err, lesDoc: LessonDocument) => {
      console.log("error", err);
      console.log("lesDoc", lesDoc.toJSON());
    })
    mongoose.connection.close(done);
  });*/

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
