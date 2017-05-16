import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';


import { ModalModule, PopoverModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';

import { LessonRoutingModule } from './lesson.routes';
import { LessonComponent } from './components/lesson.component';
import { LessonAdminComponent } from './components/admin/lesson-admin.component';
import { LessonAdminAddModalComponent } from './components/admin/lesson-admin-add-modal.component';
import { LessonAdminDeleteModalComponent } from './components/admin/lesson-admin-delete-modal.component';
import { LessonConfirmModalComponent } from './components/shared/lesson-confirm-modal.component';
import { LessonService } from './services/lesson.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MomentModule,
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
    LessonConfirmModalComponent
  ],
  providers: [
    LessonService
  ],
  exports: [
    LessonComponent
  ]
})

export class LessonModule { }