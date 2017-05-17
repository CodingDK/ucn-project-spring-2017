import { Document, model, Schema, Types } from 'mongoose';
import { getNewSchemaWithDefaultOptions } from '../helpers';

export class DbMeetUp {
  checkIn: Date;
  checkOut: Date;
  topic: string;
  student: Types.ObjectId;
}

/**
 * Model class for a dbLesson object
 */
export class DbLesson {
  startTime: Date;
  endTime: Date;
  teachers: Types.ObjectId[]
  schoolClasses: string[];
  meetUps: DbMeetUp[];
}

const meetUpSchema = getNewSchemaWithDefaultOptions({
  checkIn: { type: Date },
  checkOut: { type: Date },
  student: { type: Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String }
});

const schema = getNewSchemaWithDefaultOptions({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  schoolClasses: [{ type: String, required: true }],
  meetUps: [meetUpSchema]
});


export interface LessonDocument extends DbLesson, Document { }

/**
 * Mongoose collection for Lessons
 */
export const Lessons = model<LessonDocument>('Lesson', schema);