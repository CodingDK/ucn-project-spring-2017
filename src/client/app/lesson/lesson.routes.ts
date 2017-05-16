import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LessonComponent } from './components/lesson.component';
import { AuthGuard } from '../services/auth.guard';
import { LessonAdminAddModalComponent } from './components/admin/lesson-admin-add-modal.component';
import { LessonAdminDeleteModalComponent } from './components/admin/lesson-admin-delete-modal.component';

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
          component: LessonAdminDeleteModalComponent
        }
      ]
    }//, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class LessonRoutingModule { }