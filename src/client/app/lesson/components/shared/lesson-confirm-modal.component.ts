import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ModalDirective, PopoverDirective } from 'ngx-bootstrap';

@Component({
  selector: 'lesson-confirm-modal',
  templateUrl: './lesson-confirm-modal.component.html',
  styleUrls: ['./lesson-confirm-modal.component.scss']
})
export class LessonConfirmModalComponent {
  @ViewChild('confirmModal')
  private confirmModal: ModalDirective;
  @Output() onConfirmed = new EventEmitter<void>();
  @Output() onHidden = new EventEmitter<void>();

  @Input() title: string;
  @Input() body: any;
  @Input() btnText: string;
  @Input() btnClass: string;
  
  //public isModalShown: boolean = false;

  constructor() {
  }

  public confirm(): void {
    this.onConfirmed.emit();
    this.hideModal();
    //this.hideModal();
  }

  public showModal(): void {
    //this.isModalShown = true;
  }

  public hideModal(): void {
    this.confirmModal.hide();
  }

  private onHiddenModal(): void {
    this.onHidden.emit();
    //this.isModalShown = false;
  }
}