import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max , IsString } from "class-validator";

export class CreateLessonViewModel {
  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  teachers: string[];

  @IsString()

  @Length(10, 20)
  schoolClass: string;
}