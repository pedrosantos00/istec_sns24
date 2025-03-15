import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { UserService } from '../../shared/services/user/user.service';
import { RecoverPassword } from '../../shared/interfaces/user/recoverPassword';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    RouterLink,
    NgIcon,
  ],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;

  constructor(private userService: UserService, private toastr: ToastrService,private router: Router) {
    this.forgotForm = new FormGroup({
      documentNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      birthdate: new FormControl('', [Validators.required]),
    });
  }

  get documentNumber() {
    return this.forgotForm.get('documentNumber');
  }

  get email() {
    return this.forgotForm.get('email');
  }

  get birthdate() {
    return this.forgotForm.get('birthdate');
  }

  submit() {
    if (this.forgotForm.invalid) {
      this.toastr.error('Preencha todos os campos');
      this.forgotForm.markAllAsTouched();
    }

    const recover : RecoverPassword = {
      ...this.forgotForm.value,
    };

    this.userService.recoverPassword(recover).subscribe({
      next: (response) => {
        this.toastr.success(
          'Foi enviada uma palavra passe temporária para o seu email',
          'Email enviado com sucesso'
        );
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastr.error('Erro ao recuperar palavra passe');
      },
    });
  }
}
