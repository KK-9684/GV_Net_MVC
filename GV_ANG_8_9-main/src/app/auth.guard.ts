import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate( route: ActivatedRouteSnapshot ) {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    }

    this.router.navigate(['auth']);
    return false;
  }
}
