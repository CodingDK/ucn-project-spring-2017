import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastyModule } from 'ng2-toasty';

import { AppRoutingModule } from './app-routing.module';
import { GithubModule } from './github/github.module';
import { TempModule } from './temp/temp.module';

import { AppComponent } from './components/app.component';
import { NavbarComponent } from './components/navbar.component';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { LoginGoogleComponent } from './components/login-google.component';

import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/localstorage.service';


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
    HttpModule,
    ToastyModule.forRoot(),
    GithubModule,
    TempModule,
    AppRoutingModule // Must be last import. So Rounting childs works
    
  ],
  providers: [
    AuthGuard,
    AuthService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
