import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student.routes';
import { StudentComponent } from './components/student.component';
import { StudentService } from './services/student.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        StudentRoutingModule 
    ],

    declarations: [
        StudentComponent,
    ],
    providers: [
        StudentService     
    ],
    exports: [
        StudentComponent
    ]
})

export class StudentModule { }