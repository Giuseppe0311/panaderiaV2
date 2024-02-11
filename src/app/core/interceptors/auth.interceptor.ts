import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenservice = inject(AuthService);
  const token = tokenservice.getToken();
  if (token) {
    if (shouldAttachToken(req.url)) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    }
  }
  return next(req);
};
function shouldAttachToken(url: string): boolean {
  // Lógica para determinar si una URL necesita un token
  return (
    url.includes('/api/admin') ||
    url.includes('/api/user') ||
    url.includes('/api/superadmin') ||
    url.includes('/api/adminsucursal')
  );
}
