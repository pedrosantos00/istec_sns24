import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfirmEmailComponent } from './auth/confirm-email/confirmEmail.component';

import { DefaultComponent } from './shared/layouts/default/default.component';
import { HomeComponent } from './pages/home/home.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { CreateAppointmentComponent } from './pages/create-appointment/createAppointment.component';
import { EditAppointmentComponent } from './pages/edit-appointment/editAppointment.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { SickLeavesComponent } from './pages/sick-leaves/sick-leaves.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { InstitutionsComponent } from './pages/institutions/institutions.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'account/confirm',
    component: ConfirmEmailComponent,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'appointments/create',
        component: CreateAppointmentComponent,
      },
      {
        path: 'appointments/edit/:id',
        canActivate: [roleGuard],
        data: { roles: ['Doctor'] },
        component: EditAppointmentComponent,
      },
      {
        path: 'appointments/:id',
        component: AppointmentComponent,
      },
      {
        path: 'sick-leaves',
        component: SickLeavesComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'institutions',
        component: InstitutionsComponent,
      },
    ],
  },
];
