import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';


import { ModalModule, PopoverModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';

import { TempRoutingModule } from './temp.routes';
import { TempComponent } from './components/temp.component';
import { TempAdminComponent } from './components/admin/temp-admin.component';
import { TempAdminAddModalComponent } from './components/admin/temp-admin-add-modal.component';
import { TempAdminDeleteModalComponent } from './components/admin/temp-admin-delete-modal.component';
import { TempConfirmModalComponent } from './components/shared/temp-confirm-modal.component';
import { TempService } from './services/temp.service';

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
    TempRoutingModule
  ],

  declarations: [
    TempComponent,
    TempAdminComponent,
    TempAdminAddModalComponent,
    TempAdminDeleteModalComponent,
    TempConfirmModalComponent
  ],
  providers: [
    //GithubService
    TempService
  ],
  exports: [
    TempComponent
  ]
})

export class TempModule { }