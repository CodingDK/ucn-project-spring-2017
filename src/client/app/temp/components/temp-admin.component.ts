import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import { Lesson } from '../../../../shared/models/lesson';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { TempAdminAddModalComponent } from './temp-admin-add-modal.component';
import { TempConfirmModalComponent } from './temp-confirm-modal.component';

@Component({
  selector: 'temp-admin',
  templateUrl: './temp-admin.component.html',
  styleUrls: ['./temp-admin.component.scss']
})
export class TempAdminComponent implements AfterViewInit {
  display: boolean = false;

  @ViewChild(TempAdminAddModalComponent)
  addModal: TempAdminAddModalComponent;

  @ViewChild(TempConfirmModalComponent)
  deleteModal: TempConfirmModalComponent;

  activeItem: Lesson;

  constructor(private tempService: TempService, private toastyService: ToastyService) {
  }

  ngAfterViewInit() {
    //this.addModal.showModal();
  }

  getAll(): Lesson[] {
    return this.tempService.getAllLessons();
  }

  showModal() {
    this.display = true;
    this.addModal.showModal();
    //console.log("viewChild", );
    //this.toastyService.default('Hi there');
  }

  openDeleteModal(lesson: Lesson) {
    this.activeItem = lesson;
    this.deleteModal.showModal();
  }

  onConfirmedDelete(event: any) {
    this.tempService.deleteLesson(this.activeItem.id)
      .then((deleted: boolean) => {
        this.deleteModal.hideModal();
        if (deleted) {
          this.toastyService.success("Lektiecaf&eacute;en er blevet slettet");
        } else {
          this.toastyService.info("Lektiecaf&eacute;en blev ikke fundet, og er muligvis allerede slettet");
        }
      })
      .catch((err: any) => {
        let body = JSON.parse(err._body);
        this.toastyService.error(<ToastOptions>{
          title: "Der opstod en fejl",
          msg: body.message
        });
      });
  }
}
