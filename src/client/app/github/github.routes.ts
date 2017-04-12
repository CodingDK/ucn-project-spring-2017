import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GithubComponent } from './components/github.component';
import { AuthGuard } from '../services/auth.guard';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'github', component: GithubComponent, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class GithubRoutingModule { }