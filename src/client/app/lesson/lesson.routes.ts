import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LessonComponent } from './components/lesson.component';
import { AuthGuard } from '../services/auth.guard';
import { LessonAdminAddModalComponent } from './components/admin/lesson-admin-add-modal.component';
import { LessonAdminDeleteModalComponent } from './components/admin/lesson-admin-delete-modal.component';
import { LessonDetailResolver } from './services/lesson-detail-resolver.service';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'lesson',
      component: LessonComponent,
      children: [
        {
          path: 'add',
          component: LessonAdminAddModalComponent
        },
        {
          path: 'delete/:id',
          component: LessonAdminDeleteModalComponent,
          resolve: {
            lesson: LessonDetailResolver
          }
        },
        {
          path: 'edit/:id',
          component: LessonAdminAddModalComponent,
          resolve: {
            lesson: LessonDetailResolver
          }
        }
      ]
    }//, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class LessonRoutingModule { }