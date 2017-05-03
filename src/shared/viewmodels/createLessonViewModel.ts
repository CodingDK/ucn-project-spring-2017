import { IsDate, IsString, MinDate, ArrayNotEmpty, IsNotEmpty } from "class-validator";
import { IsLaterThan, IsValidDateObj } from "../common/customValidators";
import { JsonObject, JsonMember } from "typedjson-npm";

@JsonObject
export class CreateLessonViewModel {
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
  teachers: string[];

  @JsonMember({ type: String })
  @IsString()
  @IsNotEmpty()
  schoolClassName: string;
  
  /*constructor(data: any) {
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.teachers = data.teachers;
    this.schoolClassName = data.scoolClassName;
  }*/
}