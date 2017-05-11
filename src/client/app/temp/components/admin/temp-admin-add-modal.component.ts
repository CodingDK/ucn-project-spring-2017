import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective, PopoverDirective } from 'ngx-bootstrap';

import { isDateValidator, isDateLaterValidator } from '../../../validators/validators';
import { TempService } from '../../services/temp.service';
import { CreateLessonViewModel } from '../../../viewmodels/createLessonViewModel';
import { Lesson } from '../../../../../shared/models/lesson';

import { ValidationError } from 'class-validator';

@Component({
  selector: 'temp-admin-add-modal',
  templateUrl: './temp-admin-add-modal.component.html',
  styleUrls: ['./temp-admin-add-modal.component.scss']
})
export class TempAdminAddModalComponent implements OnInit{
  @ViewChild('addModal')
  private addModal: ModalDirective;

  @ViewChild('datePickerPopup')
  public datePickerPopup: PopoverDirective;

  public isModalShown: boolean = false;

  lessonForm: FormGroup;
  teachersInput: FormControl;
  dateInput: FormControl;
  startTimeInput: FormControl;
  endTimeInput: FormControl;
  schoolClassNameInput: FormControl;


  constructor(private tempService: TempService,
    private toastyService: ToastyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    
  }

  ngOnInit(): void {
    this.createForm();
  }

  public showModal(): void {
    this.isModalShown = true;
  }

  public hideModal(): void {
    this.addModal.hide();
  }

  public onHidden(): void {
    this.isModalShown = false;
    console.log("onHidden");
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public test(): void {
    console.log("errors showModal", this.lessonForm.errors);
    this.lessonForm.updateValueAndValidity();
    console.log("errors showModal", this.lessonForm.errors);
  }

  private createForm() {
    let start = moment().add(1, 'hour').startOf('hour');

    this.dateInput = new FormControl(start.toDate(), [isDateValidator()]);
    this.startTimeInput = new FormControl(start.toDate(), [isDateValidator]);
    this.endTimeInput = new FormControl(start.add(1, 'hour').toDate(), [isDateValidator()]);
    this.teachersInput = new FormControl('', Validators.required);
    this.schoolClassNameInput = new FormControl('');

    this.lessonForm = this.fb.group({
      date: this.dateInput,
      startTime: this.startTimeInput,
      endTime: this.endTimeInput,
      schoolClassName: this.schoolClassNameInput,
      teachers: this.teachersInput
    }, { validator: isDateLaterValidator(this.endTimeInput, this.startTimeInput) });
    //Set a trigger for updating valid state on endTime then editing in startTime
    this.startTimeInput.valueChanges.subscribe({
      next: (value: any) => {
        this.endTimeInput.updateValueAndValidity();
      }
    });
    this.lessonForm.valueChanges
      .subscribe(data => this.setErrorMessages(data));
    this.setErrorMessages(); // (re)set validation messages now
  }

  public submit(): void {
    let viewModel = this.getViewModelFromForm();
    this.tempService.createLesson(viewModel)
      .then((lesson: Lesson) => {
        this.toastyService.success("Lektiecaféen er blevet oprettet");
        this.addModal.hide();
      })
      .catch((err) => {
        let body = JSON.parse(err._body);
        if (body.errorName && body.errorName === ValidationError.name) {
          let errors = body.data as Array<ValidationError>;
          errors.forEach((e) => {
            let control = this.lessonForm.controls[e.property];
            control.setErrors(e.constraints);
            control.markAsDirty();
          })
          this.setErrorMessages();
        } else {
          this.toastyService.error(<ToastOptions>{
            title: "Der opstod en fejl",
            msg: body.message
          });
        }
      })
  }

  public getViewModelFromForm(): CreateLessonViewModel {
    const viewModel = new CreateLessonViewModel();
    let schoolClassName = this.schoolClassNameInput.value as string;
    let teachers = (<string>this.teachersInput.value).split(", ").filter(i => i);

    let date = moment(this.dateInput.value);
    let startTime = moment(this.startTimeInput.value);
    let endTime = moment(this.endTimeInput.value);
    date.set({ hour: startTime.hour(), minute: startTime.minute() })
    viewModel.startTime = date.toDate();

    let duration = moment.duration(endTime.diff(startTime));
    viewModel.endTime = date.add(duration).toDate();
    viewModel.schoolClassName = schoolClassName;
    viewModel.teachers = teachers;

    return viewModel;
  } 

  public setErrorMessages(data?: any) {
    if (!this.lessonForm) { return; }
    const form = this.lessonForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control)
      if (control && control.dirty && !control.valid && control.errors != null) {
        const messages = this.validationMessages[field];
        const errors = control.errors;
        for (const key in errors) {
          if (messages !== undefined && messages[key] !== undefined) {
            this.formErrors[field] += messages[key] + ' ';
          } else if (typeof errors[key] === "string") {
            this.formErrors[field] += errors[key] + ' ';
          } else {
            this.formErrors[field] += `Ukendt fejl: ${key} `
          }
        }
      }
    }
  }

  formErrors: any = {
    'date': '',
    'startTime': '',
    'endTime': '',
    'teachers': '',
    'schoolClassName': ''
  };

  validationMessages: any = {
    teachers: {
      'required': 'Lærere feltet skal udfyldes',
      'arrayNotEmpty': 'Lærere feltet skal udfyldes'
    },
    schoolClassName: {
      'required': 'Klasse feltet skal udfyldes',
      'isNotEmpty': 'Klasse feltet skal udfyldes'
    },
    date: {
      'isDateValidator': 'Dato formatet er ikke gyldigt',
    },
    startTime: {
      'isDateValidator': 'Tidsformatet er ikke gyldigt',
    },
    endTime: {
      'isDateValidator': 'Tidsformatet er ikke gyldigt',
      'isDateLater': 'Slut tidspunktet skal være efter start tidspunktet'
    }
  };

}

