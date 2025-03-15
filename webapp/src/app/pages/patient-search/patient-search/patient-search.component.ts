import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Patient } from '../../../shared/interfaces/patient/patient';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-patient-search',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './patient-search.component.html',
  styleUrl: './patient-search.component.scss'
})
export class PatientSearchComponent implements OnInit {
    patients: Patient[] = [];
    @Output() patientSelected = new EventEmitter<Patient>();
    showPatientModal: boolean = false;
    patientSearch: string = '';
    filteredPatients: Patient[] = [];

    constructor(private userService :UserService) {}

    ngOnInit(): void {
      this.userService.getPatients().subscribe((response) => {
        this.patients = response.data;
        this.filteredPatients = response.data;
      });
    }

    openPatientModal(): void {
      this.showPatientModal = true;
    }

    closePatientModal(): void {
      this.showPatientModal = false;
    }

    selectPatient(patient: any): void {
      this.patientSelected.emit(patient);
      this.closePatientModal();
    }

    onSearchPatients(): void {
      this.filteredPatients = this.patients.filter((patient) =>
        patient.name?.toLowerCase().includes(this.patientSearch.toLowerCase()) ||
      patient.documentNumber?.includes(this.patientSearch)
      );
    }
  }
