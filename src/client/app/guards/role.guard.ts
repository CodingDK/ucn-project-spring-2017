import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { ToastyService } from "ng2-toasty";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private toastyService: ToastyService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    //this.router.navigate(['/teacher'], { queryParams: { returnUrl: state.url } });
    const roles = route.data["roles"] as Array<string>;
    const user = this.authService.getUser();
    let hasRequiredRole = false;

    if (!user) {
      this.toastyService.error("Du er ikke logget ind, log venligst ind og prøv igen");
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      hasRequiredRole = user.roles.some(x => { return roles.indexOf(x) !== -1; });
    }
    if (!hasRequiredRole) {
      this.toastyService.error("Du har ikke adgang til denne funktion");
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
    return hasRequiredRole;
  }
}
