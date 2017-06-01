import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private toastyService: ToastyService, private authService: AuthService) {
  }

  addToast() {
    // Just add default Toast with title only
    this.toastyService.default('Hi there');
    // Or create the instance of ToastOptions
    var toastOptions: ToastOptions = {
      title: "My title",
      msg: "The message",
      showClose: true,
      timeout: 5000,
      //theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.info(toastOptions);
    this.toastyService.success(toastOptions);
    this.toastyService.wait(toastOptions);
    this.toastyService.error(toastOptions);
    this.toastyService.warning(toastOptions);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logOut(): void {
    return this.authService.logout();
  }

  isTeacher(): boolean {
    return this.authService.isUserInRole("teacher");
  }

  isStudent(): boolean {
    return this.authService.isUserInRole("student");
  }

  isAdmin(): boolean {
    return this.authService.isUserInRole("admin");
  }

  getDisplayUserRoles() {
    const user = this.getUser();
    return user ? `(${user.roles.join(", ")})` : "";
  }

  getUser() {
    return this.authService.getUser();
  }
}
