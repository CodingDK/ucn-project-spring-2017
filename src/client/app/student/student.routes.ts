import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StudentComponent } from './components/student.component';
import { AuthGuard } from '../services/auth.guard';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'student', component: StudentComponent, canActivate: [AuthGuard] }
    ])],
    exports: [RouterModule]
})
export class StudentRoutingModule { }