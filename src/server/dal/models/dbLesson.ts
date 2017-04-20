import { Document, Model } from 'mongoose';
import { getNewSchemaWithDefaultOptions } from '../helpers';

/**
 * Model class for a dbLesson object
 */
export class Lesson {
    id: string
    startTime: Date;
    endTime: Date;
    teacher: string       // should be object id
    schoolClass: string;
}

const schema = getNewSchemaWithDefaultOptions({
    id: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    teacher: { type: String, required: true },
    schoolClass: { type: String, required: true }
});

export interface LessonDocument extends DbLesson, Document { }

/**
 * Mongoose collection for Lessons
 */
export const Lessons = model<LessonDocument>('Lesson', schema);