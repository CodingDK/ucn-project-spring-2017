import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import { Lesson } from '../../../../shared/models/lesson';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {TempAdminAddModalComponent } from './temp-admin-add-modal.component';

@Component({
  selector: 'temp-admin',
  templateUrl: './temp-admin.component.html',
  styleUrls: ['./temp-admin.component.scss']
})
export class TempAdminComponent implements AfterViewInit {
  display: boolean = false;
  @ViewChild(TempAdminAddModalComponent) addModal: TempAdminAddModalComponent;

  constructor(private tempService: TempService, private toastyService: ToastyService) {
  }

  ngAfterViewInit() {
    //this.addModal.showModal();
  }

  getAll(): Lesson[] {
    return this.tempService.getAllLessons();
  }

  getDateCol(lesson: Lesson): string {
    return moment(lesson.startTime).format("dddd DD/MM");
  }

  getStartCol(lesson: Lesson): string {
    return moment(lesson.startTime).format("LT");
  }

  getEndCol(lesson: Lesson): string {
    return moment(lesson.endTime).format("LT");
  }

  showModal() {
    this.display = true;
    this.addModal.showModal();
    //console.log("viewChild", );
    //this.toastyService.default('Hi there');
  }
}