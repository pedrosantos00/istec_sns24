import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { JWTTokenService } from '../services/jwt-token/jwt-token.service';
import { r } from '@faker-js/faker/dist/airline-D6ksJFwG';

export const roleGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JWTTokenService);
  const toastr = inject(ToastrService);

  const userRole = jwtService.getRole();
  const allowedRoles = route.data?.['roles'] as string[];

  if (!allowedRoles || allowedRoles.includes(userRole ?? '')) {
    return true;
  }

  toastr.error(
    'Não tem permissão para aceder a esta página.',
    'Acesso Negado'
  );

   inject(Router).navigate(['/dashboard']);

  return false;
};
