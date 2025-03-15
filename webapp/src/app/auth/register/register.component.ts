import { Institution } from '../../shared/interfaces/institution';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { StepperComponent } from '../../shared/components/stepper/stepper/stepper.component';
import { StepComponent } from '../../shared/components/stepper/step/step.component';
import { StepConfig } from '../../shared/interfaces/common/stepper';
import { SelectComponent } from '../../shared/components/select/select/select.component';
import { SelectOptionComponent } from '../../shared/components/select/select-option/select-option.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { InstitutionsService } from '../../shared/services/institutions/institutions.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserRegisterDto } from '../../shared/interfaces/auth/userRegisterDto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    RouterLink,
    StepperComponent,
    StepComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ heroArrowLeft })],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  institutionOptions: Institution[] = [];

  passwordRequirements = [
    { id: 'uppercase', label: '1 letra maiúscula', met: false },
    { id: 'lowercase', label: '1 letra minúscula', met: false },
    { id: 'number', label: '1 número', met: false },
    { id: 'special', label: '1 caractere especial (!@#$%^&*)', met: false },
    { id: 'length', label: 'Mínimo de 8 caracteres', met: false },
  ];

  steps: StepConfig[] = [
    { title: 'Informação Pessoal', icon: 'heroUser' },
    { title: 'Morada', icon: 'heroHome' },
    { title: 'Credenciais', icon: 'heroKey' },
    { title: 'Informação Adicional', icon: 'heroInformationCircle' },
  ];

  constructor(
    private institutionsService: InstitutionsService,
    private router: Router,
    private authService: AuthService,
    private toastrService : ToastrService
  ) {
    this.registerForm = new FormGroup({
      personalInformation: new FormGroup({
        name: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('^[+]?[(]?[0-9]{1,4}[)]?([\\s.-]?[0-9]+)+$'),
        ]),
        birthdate: new FormControl('', [Validators.required]),
      }),
      address: new FormGroup({
        street: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
      credentials: new FormGroup({
        documentNumber: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      }),
      additionalInformation: new FormGroup({
        role: new FormControl('', [Validators.required]),
        snsNumber: new FormControl('', []),
        licenseNumber: new FormControl('', []),
        specialty: new FormControl('', []),
        institutions: new FormControl<Institution[]>([], [Validators.required]),
      }),
    });

    this.registerForm
      .get('credentials.password')
      ?.valueChanges.subscribe((password) => {
        this.updatePasswordRequirements(password || '');
      });

    this.registerForm
      .get('additionalInformation.role')
      ?.valueChanges.subscribe((role) => {
        const snsNumber = this.registerForm.get(
          'additionalInformation.snsNumber'
        );
        const licenseNumber = this.registerForm.get(
          'additionalInformation.licenseNumber'
        );
        const specialty = this.registerForm.get(
          'additionalInformation.specialty'
        );
        const institutions = this.registerForm.get(
          'additionalInformation.institutions'
        );

        if (role === '0') {
          snsNumber?.setValidators([Validators.required]);
          licenseNumber?.clearValidators();
          specialty?.clearValidators();
          institutions?.clearValidators();
        } else if (role === '1') {
          snsNumber?.clearValidators();
          licenseNumber?.setValidators([Validators.required]);
          specialty?.setValidators([Validators.required]);
          institutions?.setValidators([Validators.required]);
        }

        snsNumber?.updateValueAndValidity();
        licenseNumber?.updateValueAndValidity();
        specialty?.updateValueAndValidity();
        institutions?.updateValueAndValidity();
      });
  }

  ngOnInit(): void {
    this.institutionsService.getInstitutions().subscribe((institutions) => {
      this.institutionOptions = institutions.data;
    });
  }

  onInstitutionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValues = Array.from(selectElement.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    const currentValues = this.institutions?.value || [];
    const newValues = [...new Set([...currentValues, ...selectedValues])];

    this.institutions?.setValue(newValues);
  }

  updatePasswordRequirements(password: string) {
    this.passwordRequirements = [
      {
        id: 'uppercase',
        label: '1 letra maiúscula',
        met: /[A-Z]/.test(password),
      },
      {
        id: 'lowercase',
        label: '1 letra minúscula',
        met: /[a-z]/.test(password),
      },
      {
        id: 'number',
        label: '1 número',
        met: /[0-9]/.test(password),
      },
      {
        id: 'special',
        label: '1 caractere especial (!@#$%^&*)',
        met: /[!@#$%^&*]/.test(password),
      },
      {
        id: 'length',
        label: 'Mínimo de 8 caracteres',
        met: password.length >= 8,
      },
    ];
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValues = this.registerForm.value;

    const selectedInstitutionIds = this.institutions?.value;
    const selectedInstitutions = this.institutionOptions.filter((institution) =>
      selectedInstitutionIds.includes(institution.id)
    );

    const user: UserRegisterDto = {
      email: formValues.personalInformation.email,
      password: formValues.credentials.password,
      username: formValues.personalInformation.email,
      birthDate: formValues.personalInformation.birthdate,
      documentNumber: formValues.credentials.documentNumber,
      phoneNumber : formValues.personalInformation.phoneNumber,
      gender: formValues.personalInformation.gender,
      address: {
        street: formValues.address.street,
        city: formValues.address.city,
        state: formValues.address.state,
        postalCode: formValues.address.postalCode,
        country: formValues.address.country,
      },
      name: formValues.personalInformation.name,
      role: +formValues.additionalInformation.role,
      licenseNumber:
        formValues.additionalInformation.licenseNumber || undefined,
      specialty: formValues.additionalInformation.specialty || undefined,
      institutions: selectedInstitutions,
      snsNumber: formValues.additionalInformation.snsNumber || undefined,
    };

    this.authService.register(user).subscribe(
      (response) => {
        this.router.navigate(['/login']);
        this.toastrService.success('Registo com sucesso!');
      },
      (error) => {
        this.toastrService.error(error.error.message, 'Erro durante o Registo!');
      }
    );
  }

  get personalInformation() {
    return this.registerForm.get('personalInformation') as FormGroup;
  }

  get address() {
    return this.registerForm.get('address') as FormGroup;
  }

  get credentials() {
    return this.registerForm.get('credentials') as FormGroup;
  }

  get additionalInformation() {
    return this.registerForm.get('additionalInformation') as FormGroup;
  }

  // Getters for Personal Information Controls
  get name() {
    return this.personalInformation.get('name');
  }

  get gender() {
    return this.personalInformation.get('gender');
  }

  get email() {
    return this.personalInformation.get('email');
  }

  get phoneNumber() {
    return this.personalInformation.get('phoneNumber');
  }

  get birthdate() {
    return this.personalInformation.get('birthdate');
  }

  // Getters for Address Controls
  get street() {
    return this.address.get('street');
  }

  get city() {
    return this.address.get('city');
  }

  get state() {
    return this.address.get('state');
  }

  get postalCode() {
    return this.address.get('postalCode');
  }

  get country() {
    return this.address.get('country');
  }

  // Getters for Credentials Controls
  get documentNumber() {
    return this.credentials.get('documentNumber');
  }

  get password() {
    return this.credentials.get('password');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  get role() {
    return this.additionalInformation.get('role');
  }

  // Getters for Additional Information Controls
  get snsNumber() {
    return this.additionalInformation.get('snsNumber');
  }

  get licenseNumber() {
    return this.additionalInformation.get('licenseNumber');
  }

  get specialty() {
    return this.additionalInformation.get('specialty');
  }
  get institutions() {
    return this.additionalInformation.get('institutions');
  }
}
