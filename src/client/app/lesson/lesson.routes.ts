import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LessonComponent } from './components/lesson.component';
import { AuthGuard } from '../services/auth.guard';
import { LessonAdminAddModalComponent } from './components/admin/lesson-admin-add-modal.component';
import { LessonAdminDeleteModalComponent } from './components/admin/lesson-admin-delete-modal.component';
import { LessonDetailsModalComponent } from './components/teacher/lesson-details-modal.component';
import { LessonDetailResolver } from './services/lesson-detail-resolver.service';
import { LessonAdminComponent } from "./components/admin/lesson-admin.component";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'lesson',
      children: [{
        path: '',
        //pathMatch: 'full',
        component: LessonComponent,
        children: [
          {
            path: 'details/:id',
            component: LessonDetailsModalComponent,
            resolve: {
              lesson: LessonDetailResolver
            },
            data: {
              populateTeacher: true,
              populateStudent: true
            }
          }
        ]
      },
      {
        path: 'admin',
        component: LessonAdminComponent,
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
    }//, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class LessonRoutingModule { }