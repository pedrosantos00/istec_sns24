import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user/user.service';
import { UserPictureService } from '../../shared/services/userPictureProfile/user-picture-service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    RouterLink,
    NgIcon,
  ],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
    private userService: UserService,
    private pictureService: UserPictureService
  ) {
    this.loginForm = new FormGroup({
      documentNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get documentNumber() {
    return this.loginForm.get('documentNumber');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        this.toastrService.success('Login com sucesso');
        localStorage.setItem('access_token', response.token);
        this.router.navigate(['dashboard']);
        this.userService.getUser().subscribe((user) => {
        this.pictureService.updatePicture(user.data.profilePicture);
        });
      },
      (error) => {
        this.toastrService.error(error.error.message, 'Erro no Login');
      }
    );
  }
}
