import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastyModule } from 'ng2-toasty';

import { AppRoutingModule } from './app-routing.module';
import { GithubModule } from './github/github.module';

import { LessonModule } from './lesson/lesson.module';



import { AppComponent } from './components/app.component';
import { NavbarComponent } from './components/navbar.component';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { LoginGoogleComponent } from './components/login-google.component';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/localstorage.service';
import { UserService } from './services/user.service';

import { MomentModule } from 'angular2-moment';
import { LoginSimpleComponent } from "./components/login-simple.component";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { RoleGuard } from "./guards/role.guard";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    LoginGoogleComponent,
    LoginSimpleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ToastyModule.forRoot(),
    MomentModule,
    MultiselectDropdownModule,
    GithubModule,
    LessonModule,
    AppRoutingModule // Must be last import. So Rounting childs works
  ],
  providers: [
    RoleGuard,
    AuthGuard,
    AuthService,
    LocalStorageService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
