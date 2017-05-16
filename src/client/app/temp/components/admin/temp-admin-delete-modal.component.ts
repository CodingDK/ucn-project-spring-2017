import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap';


import { TempService } from '../../services/temp.service';
import { TempConfirmModalComponent } from '../shared/temp-confirm-modal.component';
import { Lesson } from '../../../../../shared/models/lesson';


@Component({
  selector: 'temp-admin-delete-modal',
  templateUrl: './temp-admin-delete-modal.component.html',
  styleUrls: ['./temp-admin-delete-modal.component.scss']
})
export class TempAdminDeleteModalComponent implements OnInit {
  @ViewChild(TempConfirmModalComponent)
  deleteModal: TempConfirmModalComponent;

  item: Lesson;

  constructor(private tempService: TempService, private toastyService: ToastyService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const item = this.tempService.getLessonById(id);
      if (item === undefined) {
        this.router.navigate(['/temp'], { relativeTo: this.route, replaceUrl: true });
        this.notFoundToasty();
      } else {
        this.item = item;
      }
    });
    
  }
    
  public onHidden(): void {
    this.router.navigate(['/temp'], { relativeTo: this.route});
  }

  public onConfirmedDelete(event: any) {
    this.tempService.deleteLesson(this.item.id)
      .then((deleted: boolean) => {
        this.deleteModal.hideModal();
        if (deleted) {
          this.toastyService.success("Lektiecaf&eacute;en er blevet slettet");
        } else {
          this.notFoundToasty();
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

  public notFoundToasty() {
    this.toastyService.info("Lektiecaf&eacute;en blev ikke fundet, og er muligvis allerede slettet");
  }
}

