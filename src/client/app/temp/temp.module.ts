import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';


import { ModalModule, PopoverModule, DatepickerModule, TimepickerModule } from 'ngx-bootstrap';

import { TempRoutingModule } from './temp.routes';
import { TempComponent } from './components/temp.component';
import { TempAdminComponent } from './components/temp-admin.component';
import { TempAdminAddModalComponent } from './components/temp-admin-add-modal.component';
import { TempConfirmModalComponent } from './components/temp-confirm-modal.component';
import { TempService } from './services/temp.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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