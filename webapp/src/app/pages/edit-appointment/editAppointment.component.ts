import { Institution } from './../../shared/interfaces/institution';
import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';
import { MedicalAppointment } from '../../shared/interfaces/medical-appointment/medical-appointment';
import { MedicalAppointmentService } from '../../shared/services/medical-appointment/medicalAppointment.service';
import { ToastrService } from 'ngx-toastr';
import { PatientSearchComponent } from '../patient-search/patient-search/patient-search.component';
import { Patient } from '../../shared/interfaces/patient/patient';
import { InstitutionsService } from '../../shared/services/institutions/institutions.service';
import { SelectComponent } from '../../shared/components/select/select/select.component';

@Component({
  selector: 'app-editAppointment',
  templateUrl: './editAppointment.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    RouterModule,
  ],
  styleUrls: ['./editAppointment.component.css'],
})
export class EditAppointmentComponent implements OnInit {
  editAppointmentForm: FormGroup;
  isPacient: boolean = true;
  today: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  includeMedicalLeave: boolean = false;
  selectedPatient: Patient | undefined;
  appointmentId!: string;
  institutions: Institution[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private institutionsService: InstitutionsService,
    private medicalAppointmentService: MedicalAppointmentService
  ) {
    this.editAppointmentForm = this.fb.group({
      reasonForVisit: ['', [Validators.required, Validators.maxLength(100)]],
      appointmentType: ['', Validators.required],
      specialty: ['', Validators.required],
      symptoms: ['', [Validators.required, Validators.maxLength(250)]],
      diagnosis: ['', Validators.maxLength(250)],
      institution: ['', Validators.required],
      prescription: ['', Validators.maxLength(250)],
      date: ['', Validators.required],
      medicalLeave: this.fb.group({
        diagnosis: [''],
        startDate: [''],
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
    this.appointmentId = this.route.snapshot.params['id'];
    this.institutionsService.getFilteredInstitutions().subscribe((response) => {
      this.institutions = response.data;
    });
    this.fetchAppointmentData();
  }

  fetchAppointmentData(): void {
    this.medicalAppointmentService
      .getAppointmentById(this.appointmentId)
      .subscribe((response) => {
        this.populateForm(response.data);
      });
  }

  populateForm(appointment: MedicalAppointment): void {
    this.selectedPatient = appointment.appointment.patientId
      ? ({
          id: appointment.appointment.patientId,
          documentNumber: '',
        } as Patient)
      : undefined;

    const formattedDate = appointment.appointment.date
      ? formatDate(appointment.appointment.date, 'yyyy-MM-dd', 'en')
      : this.today;

    // Set institution by ID
    this.editAppointmentForm.patchValue({
      reasonForVisit: appointment.reasonForVisit,
      appointmentType: appointment.appointmentType,
      specialty: appointment.specialty,
      symptoms: appointment.symptoms,
      diagnosis: appointment.diagnosis,
      institution: appointment.appointment.institutionId,
      prescription: appointment.prescription,
      date: formattedDate,
      medicalLeave: appointment.medicalLeave || {},
    });

    this.includeMedicalLeave = !!appointment.medicalLeave;
  }

  toggleMedicalLeave(): void {
    this.includeMedicalLeave = !this.includeMedicalLeave;

    const medicalLeaveGroup = this.editAppointmentForm.get(
      'medicalLeave'
    ) as FormGroup;

    if (this.includeMedicalLeave) {
      Object.keys(medicalLeaveGroup.controls).forEach((key) => {
        medicalLeaveGroup.get(key)?.setValidators(Validators.required);
      });
    } else {
      Object.keys(medicalLeaveGroup.controls).forEach((key) => {
        medicalLeaveGroup.get(key)?.clearValidators();
        medicalLeaveGroup.get(key)?.reset();
      });
    }

    medicalLeaveGroup.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.editAppointmentForm.invalid) {
      this.editAppointmentForm.markAllAsTouched();
      this.toastrService.warning(
        'Por favor, preencha todos os campos obrigatórios.',
        'Erro'
      );
      return;
    }

    const updatedAppointment: MedicalAppointment = {
      ...this.editAppointmentForm.value,
      id: this.appointmentId,
      appointment: {
        date: this.editAppointmentForm.value.date,
        attended: false,
        institutionId: this.editAppointmentForm.value.institution,
        patientId: this.selectedPatient?.id,
      },
    };

    if (!this.includeMedicalLeave) {
      updatedAppointment.medicalLeave = undefined;
    }

    this.medicalAppointmentService.update(updatedAppointment).subscribe({
      next: () => {
        this.toastrService.success(
          'Consulta atualizada com sucesso!',
          'Sucesso'
        );
        this.router.navigate(['/dashboard/appointments']);
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error(
          err.error.message || 'Erro ao atualizar consulta.',
          'Erro'
        );
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/appointments']);
  }

  get reasonForVisit() {
    return this.editAppointmentForm.get('reasonForVisit');
  }

  get appointmentType() {
    return this.editAppointmentForm.get('appointmentType');
  }

  get specialty() {
    return this.editAppointmentForm.get('specialty');
  }

  get symptoms() {
    return this.editAppointmentForm.get('symptoms');
  }

  get diagnosis() {
    return this.editAppointmentForm.get('diagnosis');
  }

  get institution() {
    return this.editAppointmentForm.get('institution');
  }

  get prescription() {
    return this.editAppointmentForm.get('prescription');
  }

  get date() {
    return this.editAppointmentForm.get('date');
  }

  get medicalLeave() {
    return this.editAppointmentForm.get('medicalLeave');
  }
}
