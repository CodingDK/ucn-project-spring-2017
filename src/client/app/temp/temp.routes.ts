import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TempComponent } from './components/temp.component';
import { AuthGuard } from '../services/auth.guard';
import { TempAdminAddModalComponent } from './components/temp-admin-add-modal.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'temp',
      component: TempComponent,
      children: [
        {
          path: 'add',
          component: TempAdminAddModalComponent
        }
      ]
    }//, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class TempRoutingModule { }