import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentComponent } from './components/student.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'student', component: StudentComponent }
    ])],
    exports: [RouterModule]
})
export class StudentRoutingModule { }