import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JWTTokenService } from '../services/jwt-token/jwt-token.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(JWTTokenService).isLoggedIn();
  const toastrService = inject(ToastrService);

  if (!isLoggedIn) {
    toastrService.warning('Precisas estar logado para aceder a esta página');
    inject(Router).navigate(['']);
  }

  return isLoggedIn;
};
