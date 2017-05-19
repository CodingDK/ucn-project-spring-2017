import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { ModalDirective, PopoverDirective } from 'ngx-bootstrap';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

import { isDateValidator, isDateLaterValidator } from '../../../validators/validators';
import { LessonService } from '../../services/lesson.service';
import { UserService } from '../../../services/user.service';
import { CreateLessonViewModel } from '../../../models/viewmodels/createLessonViewModel';

import { ISchoolClass, ILesson, IUser } from '../../../../../shared/interfaces/iModels';


import { ValidationError } from 'class-validator';

@Component({
  selector: 'lesson-admin-add-modal',
  templateUrl: './lesson-admin-add-modal.component.html',
  styleUrls: ['./lesson-admin-add-modal.component.scss']
})
export class LessonAdminAddModalComponent implements OnInit {
  @ViewChild('addModal')
  private addModal: ModalDirective;

  @ViewChild('datePickerPopup')
  public datePickerPopup: PopoverDirective;
  
  item: ILesson; //item for editing view

  lessonForm: FormGroup;
  teachersInput: FormControl;
  dateInput: FormControl;
  startTimeInput: FormControl;
  endTimeInput: FormControl;
  schoolClassNamesInput: FormControl;

  teachersHelper = new MultiSelectHelper("lærer", "lærere");
  schoolClassHelper = new MultiSelectHelper("klasse", "klasser");

  constructor(private lessonService: LessonService,
    private userService: UserService,
    private toastyService: ToastyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { lesson: ILesson }) => {
        this.item = data.lesson;
      });
    this.createForm();
    this.setValuesInDropdowns()
      .then(this.populateFormIfEditing.bind(this));

  }

  public isEditing(): boolean {
    return (this.item != undefined);
  };
  
  public hideModal(): void {
    this.addModal.hide();
  }

  public onHidden(): void {
    this.router.navigate(['/lesson'], { relativeTo: this.route });
  }

  private setValuesInDropdowns(): Promise<void[]> {
    //Get All schoolClasses and put them in select field
    const setSchoolClassesPromise = this.userService.getAllSchoolClasses()
      .then((schoolClasses: ISchoolClass[]) => {
        let values = schoolClasses.map((schoolClass) => {
          return <IMultiSelectOption>{
            id: schoolClass.name,
            name: schoolClass.name
          };
        });
        this.schoolClassHelper.options = values;
      })
      .catch((err: any) => {
        console.log("LessonAdminAddModal - getAllSchoolClasses: ", err);
        this.promiseErrorHandler(err);
      });

    //Get All teachers and put them in select field
    const setTeachersPromise = this.userService.getAllUsers(['teacher'])
      .then((users) => {
        let values = users.map((user) => {
          return <IMultiSelectOption>{
            id: user.id,
            name: user.name
          };
        });
        this.teachersHelper.options = values;
      })
      .catch((err: any) => {
        console.log("LessonAdminAddModal - getAllUsers: ", err);
        this.promiseErrorHandler(err);
      });

    return Promise.all([setSchoolClassesPromise, setTeachersPromise])
  }

  private promiseErrorHandler(err: any): void {
    this.toastyService.error(<ToastOptions>{
      title: "Der opstod en fejl",
      msg: `Der er opstået en ukendt fejl:<br />${err.status} - ${err.statusText}`
    });
  }

  private createForm() {
    let start = moment().add(1, 'hour').startOf('hour');

    this.dateInput = new FormControl(start.toDate(), [isDateValidator()]);
    this.startTimeInput = new FormControl(start.toDate(), [isDateValidator]);
    this.endTimeInput = new FormControl(start.add(1, 'hour').toDate(), [isDateValidator()]);
    this.teachersInput = new FormControl([], Validators.required);
    this.schoolClassNamesInput = new FormControl([], Validators.required);

    this.lessonForm = this.fb.group({
      date: this.dateInput,
      startTime: this.startTimeInput,
      endTime: this.endTimeInput,
      schoolClassNames: this.schoolClassNamesInput,
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

  private populateFormIfEditing(): void {
    if (this.isEditing()) {
      const item = this.item;
      this.dateInput.setValue(new Date(item.startTime));
      this.startTimeInput.setValue(new Date(item.startTime));
      this.endTimeInput.setValue(new Date(item.endTime));
      this.teachersInput.setValue(item.teachers.map(v => { return v.id; }));
      this.schoolClassNamesInput.setValue(item.schoolClasses.map(v => { return v.name }));
    }
  }

  public submit(): void {
    let viewModel = this.getViewModelFromForm();
    let promise;
    if (this.isEditing()) {
      promise = this.lessonService.updateLesson(viewModel)
        .then((lesson: ILesson) => {
          return "Lektiecaféen er blevet opdateret";
        });
    } else {
      promise = this.lessonService.createLesson(viewModel)
        .then((lesson: ILesson) => {
          return "Lektiecaféen er blevet oprettet";
        });
    }

    promise
      .then((text) => {
        this.toastyService.success(text);
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
      });
  }

  public getViewModelFromForm(): CreateLessonViewModel {
    const viewModel = new CreateLessonViewModel();
    if (this.isEditing()) {
      viewModel.id = this.item.id;
    }
    let schoolClassNames = this.schoolClassNamesInput.value;
    let teachers = this.teachersInput.value;

    let date = moment(this.dateInput.value);
    let startTime = moment(this.startTimeInput.value);
    let endTime = moment(this.endTimeInput.value);
    date.set({ hour: startTime.hour(), minute: startTime.minute() })
    viewModel.startTime = date.toDate();

    let duration = moment.duration(endTime.diff(startTime));
    viewModel.endTime = date.add(duration).toDate();
    viewModel.schoolClassNames = schoolClassNames;
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
    'schoolClassNames': ''
  };

  validationMessages: any = {
    teachers: {
      'required': 'Lærere feltet skal udfyldes',
      'arrayNotEmpty': 'Lærere feltet skal udfyldes'
    },
    schoolClassNames: {
      'required': 'Klasse feltet skal udfyldes',
      'arrayNotEmpty': 'Klasse feltet skal udfyldes'
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

class MultiSelectHelper {
  texts: IMultiSelectTexts = {
    checkAll: 'Vælge alle',
    uncheckAll: 'Fjern alle',
    checked: `${this.typeName} valgt`,
    checkedPlural: `${this.typeNames} valgt`,
    searchPlaceholder: 'Find',
    defaultTitle: 'Vælg',
    allSelected: 'Alle valgt',
  };
  settings: IMultiSelectSettings = {
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block btn-select',
    dynamicTitleMaxItems: 2,
    displayAllSelectedText: true,
    containerClasses: ''
  };
  options: IMultiSelectOption[];

  constructor(private typeName: string, private typeNames: string) {

  }
}