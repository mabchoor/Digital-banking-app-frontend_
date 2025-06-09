import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Auth Interceptor - Processing request:', {
    url: req.url,
    hasToken: !!token,
    isAuthRequest: req.url.includes('/auth/'),
  });

  // Clone the request and add the token if it exists and it's not an auth request
  let modifiedReq = req;
  if (token && !req.url.includes('/auth/')) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Auth Interceptor - Added Authorization header');
  }

  console.log('Auth Interceptor - Final request URL:', modifiedReq.url);
  return next(modifiedReq);
};
