import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  private authservice = inject(AuthService);
  private router = inject(Router);
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['expectedRoles'];
    const tokenExist = this.authservice.currentUserLoginOn.value;
    const tokenPayload: any = this.authservice.decodeToken();

    if (!tokenExist || !tokenPayload) {
      this.redirectBasedOnRoute(route);
      return false;
    }

    const hasRequiredRole = requiredRoles.some((role: any) =>
      tokenPayload.roles.includes(role)
    );
    if (!hasRequiredRole) {
      alert('No tienes permiso para acceder a esta página.');
      return false;
    }

    const routeIdEmpresa = route.params['idempresa'];
    const routeIdSucursal = route.params['idsucursal'];
    let accessGranted = true; // Asume por defecto que el acceso está permitido

    // Verifica la coincidencia de idempresa si está presente tanto en el token como en la ruta
    if (tokenPayload.idempresa && routeIdEmpresa) {
      if (tokenPayload.idempresa.toString() !== routeIdEmpresa) {
        alert('La empresa no coincide.');
        accessGranted = false;
      }
    }

    // Verifica la coincidencia de idsucursal si está presente tanto en el token como en la ruta
    if (tokenPayload.idsucursal && routeIdSucursal) {
      if (tokenPayload.idsucursal.toString() !== routeIdSucursal) {
        alert('La sucursal no coincide.');
        accessGranted = false;
      }
    }

    // Permite el acceso si no es necesario validar idempresa o idsucursal,
    // o si las validaciones de estos campos son exitosas.
    if (accessGranted) {
      console.log('Acceso concedido.');
      return true;
    } else {
      return false; // Acceso denegado si alguna de las validaciones falla
    }
  }
  private redirectBasedOnRoute(route: ActivatedRouteSnapshot): void {
    const returnUrl = route.pathFromRoot
      .map((v) => v.url.map((segment) => segment.toString()).join('/'))
      .join('/');
    if (this.isBrowser()) {
      localStorage.setItem('returnUrl', returnUrl); // Almacena el returnUrl en localStorage
    }
    const requiredRoles = route.data['expectedRoles'];

    // Define la URL de login basada en los roles requeridos o redirige al login general
    let loginUrl = '/login'; // Default a login general
    if (requiredRoles) {
      if (requiredRoles.includes('ADMIN')) {
        loginUrl = '/login-admin';
      } else if (requiredRoles.includes('SUPERADMIN')) {
        loginUrl = '/login-superadmin';
      } else if (requiredRoles.includes('USER')) {
        loginUrl = '/login'; // Asumo que querías decir '/login-user' en lugar de '/login-caca'
      } else if (requiredRoles.includes('SUCURSALADMIN')) {
        loginUrl = '/login';
      }
    }

    // Redirige al usuario a la página de login correspondiente con el returnUrl como parámetro
    this.router.navigate([loginUrl], { queryParams: { returnUrl } });
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
