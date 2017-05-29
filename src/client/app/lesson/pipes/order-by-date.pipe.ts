import { Pipe, PipeTransform } from '@angular/core';
import { ILesson } from "../../../../shared/interfaces/iModels";

@Pipe({
  name: 'orderByDate'
})

export class OrderByDatePipe implements PipeTransform {
  transform(array: ILesson[], args: string): ILesson[] | undefined {

  if(!array || array === undefined || array.length === 0) return undefined;
    array.sort((a: ILesson, b: ILesson) => {
      if (a.startTime > b.startTime) {
        return -1;
      } else if (a.startTime < b.startTime) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}