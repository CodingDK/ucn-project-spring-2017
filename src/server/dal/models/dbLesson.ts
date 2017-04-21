import { Document, model } from 'mongoose';
import { getNewSchemaWithDefaultOptions } from '../helpers';

import { MeetUp } from '../../../shared/models/meetUp';

/**
 * Model class for a dbLesson object
 */
export class DbLesson {
  startTime: Date;
  endTime: Date;
  teacher: string[] // should be object id
  schoolClass: string;
  meetUps: MeetUp
}

const meetUpSchema = getNewSchemaWithDefaultOptions({
  checkIn: { type: Date },
  checkOut: { type: Date },
  student : { type: String, ref: 'User' },
  topic: { type: String }
});

const schema = getNewSchemaWithDefaultOptions({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  teacher: [{ type: String, ref: 'User' }],
  schoolClass: { type: String, required: true },
  meetUps: [meetUpSchema]
});

export interface LessonDocument extends DbLesson, Document { }

/**
 * Mongoose collection for Lessons
 */
export const Lessons = model<LessonDocument>('Lesson', schema);