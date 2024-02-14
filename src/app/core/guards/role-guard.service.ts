import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['expectedRoles'];
    const tokenExists = this.authService.currentUserLoginOn.value;
    const tokenPayload: any = this.authService.decodeToken();
    console.log('tokenExists', tokenExists);
    console.log('tokenPayload', tokenPayload);
    console.log('requiredRoles', requiredRoles);
    if (!tokenExists || !tokenPayload) {
      this.redirectToLogin();
      return false;
    }

    const userRoles = Array.isArray(tokenPayload.roles) ? tokenPayload.roles : tokenPayload.roles.split(',');
    if (!this.hasRequiredRole(userRoles, requiredRoles)) {
      this.handleUnauthorizedAccess();
      return false;
    }

    if (!this.validateRoleRequirements(userRoles, tokenPayload)) {
      this.handleUnauthorizedAccess();
      return false;
    }

    if (this.validateAccessByRoute(tokenPayload, route.params)) {
      return true;
    } else {
      return false;
    }
  }

  private hasRequiredRole(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
 
  }

  private validateRoleRequirements(userRoles: string[], tokenPayload: any): boolean {
    if (userRoles.includes('ADMIN') && tokenPayload.idempresa === undefined) {
      alert('No tienes acceso a esta empresa porque no se especificó idEmpresa en el token.');
      return false;
    }

    if (userRoles.includes('ADMINSUCURSAL') && (tokenPayload.idempresa === undefined || tokenPayload.idsucursal === undefined)) {
      alert('No tienes acceso a esta sucursal porque no se especificaron idEmpresa o idSucursal en el token.');
      return false;
    }

    return true;
  }

  private validateAccessByRoute(tokenPayload: any, routeParams: {[key: string]: string}): boolean {
    const { idempresa, idsucursal } = routeParams;

    if (tokenPayload.idempresa && idempresa && tokenPayload.idempresa.toString() !== idempresa) {
      this.redirectToLogin();
      alert('No tienes acceso a esta empresa.');
      return false;
    }

    if (tokenPayload.idsucursal && idsucursal && tokenPayload.idsucursal.toString() !== idsucursal) {
      this.redirectToLogin();
      alert('La sucursal no coincide.');
      return false;
    }

    return true;
  }


  private redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  private handleUnauthorizedAccess(): void {
    this.authService.logout();
    if (!this.isLoginPage()) {
      this.router.navigate(['/login']);
    } else {
      alert('Ya estás en la página de login.');
    }
  }

  private isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
