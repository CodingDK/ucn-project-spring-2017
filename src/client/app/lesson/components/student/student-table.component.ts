import { Component, Input } from '@angular/core';
import { ILesson } from "../../../../../shared/interfaces/iModels";

@Component({
    selector: 'student-table',
    templateUrl: 'student-table.component.html',
    styleUrls: ['student-table.component.scss']
})
export class StudentTableComponent {
    //@Input() lessons: ILesson[];
    //@Input() btnCol: any;


    //getSchoolClassNames(lesson: ILesson) {
    //    let schoolClasses = lesson.schoolClasses;
    //    let names = schoolClasses.map(value => { return value.name });
    //    return this.formatArray(names);
    //}

    //private formatArray(arr: any[]): string {
    //    var outStr = "";
    //    if (arr.length === 1) {
    //        outStr = arr[0];
    //    } else if (arr.length === 2) {
    //        //joins all with "and" but no commas
    //        //example: "bob and sam"
    //        outStr = arr.join(' og ');
    //    } else if (arr.length > 2) {
    //        //joins all with commas, but last one gets ", and" (oxford comma!)
    //        //example: "bob, joe, and sam"
    //        outStr = arr.slice(0, -1).join(', ') + ' og ' + arr.slice(-1);
    //    }
    //    return outStr;
    //}
}