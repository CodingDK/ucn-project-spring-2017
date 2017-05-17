import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastyModule } from 'ng2-toasty';

import { AppRoutingModule } from './app-routing.module';
import { GithubModule } from './github/github.module';

import { LessonModule } from './lesson/lesson.module';
import { StudentModule } from './student/student.module';


import { AppComponent } from './components/app.component';
import { NavbarComponent } from './components/navbar.component';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { LoginGoogleComponent } from './components/login-google.component';

import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/localstorage.service';
import { LessonService } from './services/lesson.service';

import { MomentModule } from 'angular2-moment';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    LoginGoogleComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ToastyModule.forRoot(),
    MomentModule,
    GithubModule,
    LessonModule,
    StudentModule,
    AppRoutingModule // Must be last import. So Rounting childs works
    
  ],
  providers: [
    AuthGuard,
    AuthService,
    LocalStorageService,
    LessonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
