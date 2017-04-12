import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { GithubRoutingModule } from './github.routes';
import { GithubComponent } from './components/github.component';

import { GithubService } from './services/github.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    GithubRoutingModule
  ],

  declarations: [
    GithubComponent
  ],
  providers: [
    GithubService
  ],
  exports: [
    GithubComponent
  ]
})

export class GithubModule { }