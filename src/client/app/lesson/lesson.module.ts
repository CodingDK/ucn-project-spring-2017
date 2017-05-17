import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { ModalModule, PopoverModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';

import { LessonRoutingModule } from './lesson.routes';
import { LessonComponent } from './components/lesson.component';
import { LessonAdminComponent } from './components/admin/lesson-admin.component';
import { LessonAdminAddModalComponent } from './components/admin/lesson-admin-add-modal.component';
import { LessonAdminDeleteModalComponent } from './components/admin/lesson-admin-delete-modal.component';
import { LessonConfirmModalComponent } from './components/shared/lesson-confirm-modal.component';


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
    LessonConfirmModalComponent
  ],
  providers: [
  ],
  exports: [
    LessonComponent
  ]
})

export class LessonModule { }