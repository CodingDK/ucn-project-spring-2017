import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LessonComponent } from './components/lesson.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from "../guards/role.guard";
import { LessonAdminAddModalComponent } from './components/admin/lesson-admin-add-modal.component';
import { LessonAdminDeleteModalComponent } from './components/admin/lesson-admin-delete-modal.component';
import { LessonDetailsModalComponent } from './components/teacher/lesson-details-modal.component';
import { LessonDetailResolver } from './services/lesson-detail-resolver.service';
import { LessonAdminComponent } from "./components/admin/lesson-admin.component";

// student
import { LessonStudentComponent } from './components/student/lesson-student.component';
import { LessonGetAllResolver } from "./services/lesson-get-all-resolver.service";
import { Roles } from "../../../shared/constants/roles";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'lesson',
      canActivate: [AuthGuard, RoleGuard],
      data: { roles: [Roles.teacher, Roles.admin, Roles.student] },
      //canActivateChild: [AuthGuard],
      children: [{
        path: '',
        //pathMatch: 'full',
        component: LessonComponent,
        canActivate: [RoleGuard],
        data: { roles: [Roles.teacher, Roles.student] },
        resolve: {
          lessons: LessonGetAllResolver
        },
        children: [
          {
            path: 'details/:id',
            component: LessonDetailsModalComponent,
            resolve: {
              lesson: LessonDetailResolver
            },
            canActivate: [RoleGuard],
            data: {
              roles: [Roles.teacher],
              populateTeacher: true,
              populateStudent: true
            }
          }
        ]
      },
      {
        path: 'admin',
        component: LessonAdminComponent,
        canActivate: [RoleGuard],
        data: { roles: [Roles.teacher, Roles.admin] },
        resolve: {
          lessons: LessonGetAllResolver
        },
        children: [{
          path: 'add',
          component: LessonAdminAddModalComponent
        },
        {
          path: 'delete/:id',
          component: LessonAdminDeleteModalComponent,
          resolve: {
            lesson: LessonDetailResolver
          },
          data: {
            populateTeacher: true
          }
        },
        {
          path: 'edit/:id',
          component: LessonAdminAddModalComponent,
          resolve: {
            lesson: LessonDetailResolver
          },
          data: {
            populateTeacher: true
          }
        }]
      }]
    }
  ])],
  exports: [RouterModule]
})
export class LessonRoutingModule { }
