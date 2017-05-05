import { Component, ViewChild } from '@angular/core';
import { ModalDirective, PopoverDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'temp-admin-add-modal',
  templateUrl: './temp-admin-add-modal.component.html',
  styleUrls: ['./temp-admin-add-modal.component.scss']
})
export class TempAdminAddModalComponent {
  @ViewChild('addModal')
  private addModal: ModalDirective;

  @ViewChild('datePickerPopup')
  public datePickerPopup: PopoverDirective;

  public isModalShown: boolean = false;
  public model: any;

  constructor(private toastyService: ToastyService) {
    let start = moment().add(1, 'hour').startOf('hour');
    this.model = {
      date: start.toDate(),
      startTime: start.toDate(),
      endTime: start.add(1, 'hour').toDate()
    }
  }

  public submit(): void {
    console.log("called submit?");
    this.toastyService.success("Lektiecaféen er blevet oprettet");
    this.hideModal();
  }

  public showModal(): void {
    this.isModalShown = true;
  }

  public hideModal(): void {
    this.addModal.hide();
  }

  public onHidden(): void {
    this.isModalShown = false;
  }

  public getPrettyDate() {
    return moment(this.model.date).format("L");
  }


  public hideDatePickerPopup(e: any) {
    //Timeout is a workaround for getting model.date updated, 
    //activeDateChange event on datepicker not working right now, so i used selectionDone instead,
    //but it's hide the popup before the model.date is set
    setTimeout(() => { 
      this.datePickerPopup.hide();
    }, 10)
  }
}

