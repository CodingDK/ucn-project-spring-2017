import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor() {}
  //TODO make a better fix for scroll-problem than changing page
  onDeactivate() {
    document.body.scrollTop = 0;
  }
}
