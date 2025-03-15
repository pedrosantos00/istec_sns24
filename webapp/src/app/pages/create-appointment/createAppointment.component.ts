import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';
import { MedicalAppointment } from '../../shared/interfaces/medical-appointment/medical-appointment';
import { MedicalAppointmentService } from '../../shared/services/medical-appointment/medicalAppointment.service';
import { ToastrService } from 'ngx-toastr';
import { PatientSearchComponent } from '../patient-search/patient-search/patient-search.component';
import { Patient } from '../../shared/interfaces/patient/patient';
import { Institution } from '../../shared/interfaces/institution';
import { InstitutionsService } from '../../shared/services/institutions/institutions.service';
import { SelectComponent } from '../../shared/components/select/select/select.component';

@Component({
  selector: 'app-createAppointment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    RouterModule,
    PatientSearchComponent,
  ],
  templateUrl: './createAppointment.component.html',
  styleUrls: ['./createAppointment.component.css'],
})
export class CreateAppointmentComponent implements OnInit {
  createAppointmentForm: FormGroup;
  isPacient: boolean = true;
  today: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  includeMedicalLeave: boolean = false;
  selectedPatient: Patient | undefined;
  institutions: Institution[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private jwtService: JWTTokenService,
    private medicalAppointmentService: MedicalAppointmentService,
    private institutionsService: InstitutionsService,
    private toastrService: ToastrService
  ) {
    this.createAppointmentForm = this.fb.group({
      reasonForVisit: ['', [Validators.required, Validators.maxLength(100)]],
      appointmentType: ['', Validators.required],
      specialty: ['', Validators.required],
      symptoms: ['', [Validators.required, Validators.maxLength(250)]],
      diagnosis: ['', Validators.maxLength(250)],
      institution : ['', Validators.required],
      prescription: ['', Validators.maxLength(250)],
      documentNumber: ['', Validators.required],
      date: [this.today, Validators.required],
      medicalLeave: this.fb.group({
        diagnosis: [''],
        startDate: [this.today],
        endDate: [''],
        recommendations: [''],
        isPublicSector: [false],
        employer: [''],
        jobFunction: [''],
        educationLevel: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.isPacient = this.jwtService.isPacient();

    this.institutionsService.getFilteredInstitutions().subscribe((response) => {
      this.institutions = response.data;
      this.institution?.setValue(this.institutions[0]?.id);
    });

    if (this.isPacient) {
      this.createAppointmentForm.get('medicalLeave')?.disable();
      this.appointmentType?.disable();
      this.documentNumber?.disable();
      this.specialty?.disable();
      this.prescription?.disable();
      this.diagnosis?.disable();
      this.specialty?.disable();
    } else {
      this.createAppointmentForm.get('medicalLeave')?.enable();
    }
  }

  onPatientSelected(patient: Patient): void {
    this.selectedPatient = patient;

    this.documentNumber?.setValue(patient.documentNumber);
    this.documentNumber?.updateValueAndValidity();
  }

  toggleMedicalLeave(): void {
    this.includeMedicalLeave = !this.includeMedicalLeave;

    const medicalLeaveGroup = this.createAppointmentForm.get(
      'medicalLeave'
    ) as FormGroup;

    if (this.includeMedicalLeave) {
      // Add required validators to medical leave fields
      medicalLeaveGroup.get('diagnosis')?.setValidators(Validators.required);
      medicalLeaveGroup.get('startDate')?.setValidators(Validators.required);
      medicalLeaveGroup.get('endDate')?.setValidators(Validators.required);
      medicalLeaveGroup
        .get('recommendations')
        ?.setValidators(Validators.required);
      medicalLeaveGroup.get('employer')?.setValidators(Validators.required);
      medicalLeaveGroup.get('jobFunction')?.setValidators(Validators.required);
      medicalLeaveGroup
        .get('educationLevel')
        ?.setValidators(Validators.required);
    } else {
      // Clear validators for medical leave fields
      Object.keys(medicalLeaveGroup.controls).forEach((key) => {
        medicalLeaveGroup.get(key)?.clearValidators();
        medicalLeaveGroup.get(key)?.reset(); // Reset to null
      });
    }

    // Update validation status
    medicalLeaveGroup.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.createAppointmentForm.invalid) {
      this.createAppointmentForm.markAllAsTouched();
      this.toastrService.warning(
        'Por favor, preencha todos os campos obrigatórios',
        'Erro'
      );
      return;
    }

    const newAppointment: MedicalAppointment = {
      ...this.createAppointmentForm.value,
      appointment: {
        date: this.createAppointmentForm.value.date,
        attended: false,
        patientId: this.selectedPatient?.id,
        institutionId : this.createAppointmentForm.value.institution,
      },
    };

    if (!this.includeMedicalLeave) newAppointment.medicalLeave = undefined;

    console.log(newAppointment);

    this.medicalAppointmentService.create(newAppointment).subscribe({
      next: () => {
        this.toastrService.success('Consulta criada com sucesso!');
        this.router.navigate(['/dashboard/appointments']);
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error(
          err.error.message || 'Erro ao criar consulta',
          'Erro'
        );
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/appointments']);
  }

  get reasonForVisit() {
    return this.createAppointmentForm.get('reasonForVisit');
  }

  get appointmentType() {
    return this.createAppointmentForm.get('appointmentType');
  }

  get specialty() {
    return this.createAppointmentForm.get('specialty');
  }

  get documentNumber() {
    return this.createAppointmentForm.get('documentNumber');
  }

  get symptoms() {
    return this.createAppointmentForm.get('symptoms');
  }

  get diagnosis() {
    return this.createAppointmentForm.get('diagnosis');
  }

  get prescription() {
    return this.createAppointmentForm.get('prescription');
  }

  get institution() {
    return this.createAppointmentForm.get('institution');
  }


  get date() {
    return this.createAppointmentForm.get('date');
  }

  get medicalLeave() {
    return this.createAppointmentForm.get('medicalLeave');
  }
}
