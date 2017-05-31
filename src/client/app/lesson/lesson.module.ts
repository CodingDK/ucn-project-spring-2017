import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { ModalModule, PopoverModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';

import { LessonRoutingModule } from './lesson-routing.module';
import { LessonComponent } from './components/lesson.component';
import { LessonAdminComponent } from './components/admin/lesson-admin.component';
import { LessonAdminAddModalComponent } from './components/admin/lesson-admin-add-modal.component';
import { LessonAdminDeleteModalComponent } from './components/admin/lesson-admin-delete-modal.component';
import { LessonDetailsModalComponent } from './components/teacher/lesson-details-modal.component';
import { LessonConfirmModalComponent } from './components/shared/lesson-confirm-modal.component';

import { LessonService } from './services/lesson.service';
import { LessonDetailResolver } from './services/lesson-detail-resolver.service';
import { LessonTeacherComponent } from "./components/teacher/lesson-teacher.component";
import { LessonTableComponent } from "./components/shared/lesson-table.component";
import { OrderByDatePipe } from "./pipes/order-by-date.pipe";

// student
import { LessonStudentComponent } from './components/student/lesson-student.component';
import { StudentTableComponent } from './components/student/student-table.component';
import { StudentInformationComponent } from  './components/student/student-information.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MomentModule,
    MultiselectDropdownModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    LessonRoutingModule
  ],

  declarations: [
    LessonComponent,
    LessonAdminComponent,
    LessonAdminAddModalComponent,
    LessonAdminDeleteModalComponent,
    LessonDetailsModalComponent,
    LessonConfirmModalComponent,
    LessonTeacherComponent,
    LessonTableComponent,
    LessonStudentComponent,
    StudentTableComponent,
    StudentInformationComponent,
    OrderByDatePipe
  ],
  providers: [
    LessonService,
    LessonDetailResolver
  ],
  exports: [
    LessonComponent
  ]
})

export class LessonModule { }
