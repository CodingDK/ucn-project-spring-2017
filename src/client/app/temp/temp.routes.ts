import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TempComponent } from './components/temp.component';
import { AuthGuard } from '../services/auth.guard';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'temp', component: TempComponent }//, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class TempRoutingModule { }