import { IsDate, IsString, MinDate, ArrayNotEmpty, IsNotEmpty } from "class-validator";
import { IsLaterThan, IsValidDateObj } from "../validators/customValidators";
import { IsValidTeacherIds } from '../validators/isValidTeacherIdsValidator';
import { IsValidSchoolClassNames } from '../validators/isValidSchoolClassNamesValidator';
import { JsonObject, JsonMember } from "typedjson-npm";

import { ICreateLessonViewModel } from '../../shared/interfaces/iCreateLessonViewModel';

@JsonObject
export class CreateLessonViewModel implements ICreateLessonViewModel {

  id?: string;

  @JsonMember({type: Date})
  @IsValidDateObj()
  @IsNotEmpty()
  //@MinDate(new Date())
  startTime: Date;

  @JsonMember({ type: Date })
  @IsNotEmpty()
  @IsValidDateObj()
  //@MinDate(new Date())
  @IsLaterThan("startTime")
  endTime: Date;

  @JsonMember({ type: Array, elements: String })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayNotEmpty()
  @IsValidTeacherIds()
  teachers: string[];

  @JsonMember({ type: Array, elements: String })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayNotEmpty()
  @IsValidSchoolClassNames()
  schoolClassNames: string[];

  meetUpStudents: string[];
  
  
  /*constructor(data: any) {
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.teachers = data.teachers;
    this.schoolClassName = data.scoolClassName;
  }*/
}