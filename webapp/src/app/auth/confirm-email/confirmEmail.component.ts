import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmEmail',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    RouterLink,
    NgIcon,
  ],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './confirmEmail.component.html',
  styleUrls: ['./confirmEmail.component.css'],
})
export class ConfirmEmailComponent implements OnInit {
  email: string | null = null;
  token: string | null = null;
  confirmationStatus: string = 'A processar...';
  confirmationFailed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.token) {
      console.log(this.token);
      this.token = this.token.replace(/ /g, '+');
      console.log(this.token);

    }

    if (this.email && this.token) {
      this.authService.confirmEmail(this.email, this.token).subscribe({
        next: (response) => {
          this.toastrService.success('Email confirmado com sucesso');
          this.confirmationStatus = response.message;
        },
        error: (err) => {
          console.error(err);
          this.toastrService.error('Falha na confirmação do email');
          this.confirmationStatus = err.error.message;
          this.confirmationFailed = true;
        },
      });
    } else {
      this.toastrService.warning('Link de confirmação inválido');
      this.confirmationStatus = 'Link de confirmação inválido';
      this.confirmationFailed = true;
    }
  }

  resendConfirmationEmail() {
    if (this.email) {
      this.authService.resendConfirmationEmail(this.email).subscribe({
        next: (response) => {
          this.toastrService.success('Email de confirmação enviado!');
          this.confirmationStatus =
            'Pode fechar esta página e verificar o seu email';
          this.confirmationFailed = false;
        },
        error: (err) => {
          console.error(err);
          this.toastrService.error('Erro ao pedir nova confirmação.');
        },
      });
    } else {
      this.toastrService.warning('Email inválido.');
    }
  }
}
