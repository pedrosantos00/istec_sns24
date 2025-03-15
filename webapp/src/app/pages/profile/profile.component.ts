import { Doctor } from './../../shared/interfaces/doctor/doctor';
import { UserPictureService } from '../../shared/services/userPictureProfile/user-picture-service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TabsContainerComponent } from '../../shared/components/tabs/tabs-container/tabs-container.component';
import { TabComponent } from '../../shared/components/tabs/tab/tab.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CommonModule } from '@angular/common';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';
import { UserService } from '../../shared/services/user/user.service';
import { Patient } from '../../shared/interfaces/patient/patient';
import { ToastrService } from 'ngx-toastr';
import { UpdateStorageProfilePicture } from '../../shared/interfaces/user/updateProfilePicture';
import { InstitutionsService } from '../../shared/services/institutions/institutions.service';
import { Institution } from '../../shared/interfaces/institution';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    TabsContainerComponent,
    TabComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  userPictureUrl: string | null = null;
  isDoctor = false;
  institutionOptions: Institution[] = [];
  selectedInstitutions: string[] = [];

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?([.\s-]?[0-9]+)+$/),
    ]),
    birthdate: new FormControl('', Validators.required),
    documentNumber: new FormControl('', Validators.required),
    snsNumber: new FormControl(''),
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    licenseNumber: new FormControl(''),
    specialty: new FormControl(''),
    institutions: new FormControl<string[]>([], Validators.required),
  });

  constructor(
    private userService: UserService,
    private jwtService: JWTTokenService,
    private toastrService: ToastrService,
    private userPictureService: UserPictureService,
    private institutionsService: InstitutionsService
  ) {}

  ngOnInit(): void {
    this.isDoctor = !this.jwtService.isPacient();
    this.loadUserProfile();
    this.toggleFields();
    this.loadInstitutions();

    this.userPictureService.currentPicture$.subscribe((picture) => {
      this.userPictureUrl = picture;
    });
  }

  private loadUserProfile(): void {
    this.userService.getUser().subscribe({
      next: (response) => {
        const user = response.data as Doctor | Patient;
        this.selectedInstitutions =
          (user as Doctor).institutions?.map((inst) => inst.id) || [];
        this.populateForm(user);
      },
      error: () => {
        this.toastrService.error('Erro carregar dados do utilizador.', 'Erro');
      },
    });
  }

  private loadInstitutions(): void {
    this.institutionsService.getInstitutions().subscribe({
      next: (response) => {
        this.institutionOptions = response.data;
      },
      error: () => {
        this.toastrService.error('Erro ao carregar instituições.', 'Erro');
      },
    });
  }

  private populateForm(user: Doctor | Patient): void {
    this.profileForm.patchValue({
      ...user,
      birthdate: user.birthDate
        ? new Date(user.birthDate).toISOString().split('T')[0]
        : '',
      street: user.address?.street,
      city: user.address?.city,
      state: user.address?.state,
      zipCode: user.address?.postalCode,
      country: user.address?.country,
      institutions: this.selectedInstitutions,
    });
  }

  onInstitutionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValues = Array.from(selectElement.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    this.profileForm.get('institutions')?.setValue(selectedValues);
  }

  onSubmit(): void {
    console.log(this.profileForm);
    if (this.profileForm.invalid) {
      this.toastrService.warning(
        'Por favor, preencha todos os campos obrigatórios.',
        'Atenção'
      );
      return;
    }

    const user: Doctor | Patient = {
      ...this.profileForm.value,
      address: {
        street: this.street?.value,
        city: this.city?.value,
        state: this.state?.value,
        postalCode: this.zipCode?.value,
        country: this.country?.value,
      },
      institutions: this.institutions?.value?.map((id) => {
        return this.institutionOptions.find((inst) => inst.id === id);
      }),
    } as Doctor | Patient;

    this.userService.updateUser(user).subscribe({
      next: (response) => {
        this.populateForm(response.data as Doctor | Patient);
        this.toastrService.success('Perfil atualizado com sucesso!', 'Sucesso');
      },
      error: () => {
        this.toastrService.error('Erro ao atualizar o perfil.', 'Erro');
      },
    });
  }

  private toggleFields(): void {
    const controls = [
      'snsNumber',
      'licenseNumber',
      'specialty',
      'institutions',
    ];
    controls.forEach((control) => {
      if (this.isDoctor) {
        this.profileForm.get(control)?.enable();
        this.snsNumber?.disable();
      } else {
        this.profileForm.get(control)?.disable();
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 300;
          const maxHeight = 300;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64Image = canvas.toDataURL(file.type, 0.5);

            const dto: UpdateStorageProfilePicture = {
              userId: this.jwtService.getUserId(),
              content: compressedBase64Image.split(',')[1],
              mimeType: file.type,
            };

            this.userService.updateProfilePicture(dto).subscribe({
              next: (profilePicture) => {
                this.userPictureUrl = compressedBase64Image || null;
                this.userPictureService.updatePicture(profilePicture?.data);
                this.toastrService.success(
                  'Foto de perfil atualizada com sucesso!',
                  'Sucesso'
                );
              },
              error: () => {
                this.toastrService.error(
                  'Erro ao atualizar a foto de perfil.',
                  'Erro'
                );
              },
            });
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get gender() {
    return this.profileForm.get('gender');
  }

  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }

  get birthdate() {
    return this.profileForm.get('birthdate');
  }

  get documentNumber() {
    return this.profileForm.get('documentNumber');
  }

  get snsNumber() {
    return this.profileForm.get('snsNumber');
  }

  get street() {
    return this.profileForm.get('street');
  }

  get city() {
    return this.profileForm.get('city');
  }

  get state() {
    return this.profileForm.get('state');
  }

  get zipCode() {
    return this.profileForm.get('zipCode');
  }

  get country() {
    return this.profileForm.get('country');
  }

  get licenseNumber() {
    return this.profileForm.get('licenseNumber');
  }

  get specialty() {
    return this.profileForm.get('specialty');
  }

  get institutions() {
    return this.profileForm.get('institutions');
  }
}
