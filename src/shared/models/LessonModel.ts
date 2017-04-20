namespace Models {
    export class LessonModel {

        startTime: Date;       
        endTime: Date;
        teacher: TeacherModel;
        schoolClass: SchoolClassModel;
        meetups: MeetUpModel[];         // students who met up

        constructor(startTime: Date, teacher: TeacherModel, schoolclass: string) {
            this.startTime = startTime;
            this.teacher = teacher;
            this.schoolClass = schoolclass;
        }

        get getStartTime() {
            return this.startTime;
        }

        set setStartTime(startTime: Date) {
            this.startTime = startTime;
        }

        get getEndTime() {
            return this.endTime;
        }

        set setEndTime(endTime: Date) {
            this.endTime = endTime;
        }

        get getTeacher() {
            return this.teacher;
        }

        set setTeacher(teacher: TeacherModel) {
            this.teacher = teacher;
        }

        get getSchoolClass() {
            return this.schoolClass;
        }

        set setSchoolClass(schoolClass: SchoolClassModel) {
            this.schoolClass = schoolClass;
        }

        get getMeetups() {
            return this.meetups;
        }

        set setMeetups(meetups: MeetUpModel[]) {
            this.meetups = meetups;
        }
    }
}
