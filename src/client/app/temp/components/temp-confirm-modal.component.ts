import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ModalDirective, PopoverDirective } from 'ngx-bootstrap';

@Component({
  selector: 'temp-confirm-modal',
  templateUrl: './temp-confirm-modal.component.html',
  styleUrls: ['./temp-confirm-modal.component.scss']
})
export class TempConfirmModalComponent {
  @ViewChild('confirmModal')
  private confirmModal: ModalDirective;
  @Output() onConfirmed = new EventEmitter<void>();

  @Input() title: string;
  @Input() body: any;
  @Input() btnText: string;
  @Input() btnClass: string;
  
  public isModalShown: boolean = false;

  constructor() {
  }

  public confirm(): void {
    this.onConfirmed.emit();
    //this.hideModal();
  }

  public showModal(): void {
    this.isModalShown = true;
  }

  public hideModal(): void {
    this.confirmModal.hide();
  }

  private onHidden(): void {
    this.isModalShown = false;
  }
}