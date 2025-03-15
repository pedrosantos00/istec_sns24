import { Component, OnInit } from '@angular/core';
import { MedicalAppointment } from '../../shared/interfaces/medical-appointment/medical-appointment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  heroArrowDownOnSquare,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Router, RouterModule } from '@angular/router';
import { MedicalAppointmentService } from '../../shared/services/medical-appointment/medicalAppointment.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';
import { FilterOption } from '../../shared/enums/filterOption';
import { AppointmentFilterOption } from '../../shared/enums/appointmentFilterOption';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointments',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIcon,
    ButtonComponent,
    RouterModule,
  ],
  templateUrl: './appointments.component.html',
  viewProviders: [
    provideIcons({
      heroMagnifyingGlass,
      heroArrowDownOnSquare,
    }),
  ],
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  FilterOption = AppointmentFilterOption;
  isPacient: boolean = true;
  medicalAppointments: MedicalAppointment[] = [];
  filteredAppointments: MedicalAppointment[] = [];
  displayedAppointments: MedicalAppointment[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  orderby: string = '';
  filterby: string = '';
  search: string = '';
  filteredOption: AppointmentFilterOption = AppointmentFilterOption.All;

  constructor(
    private router: Router,
    private appointmentService: MedicalAppointmentService,
    private toastr: ToastrService,
    private jwtService: JWTTokenService
  ) {}

  ngOnInit(): void {
    this.isPacient = this.jwtService.isPacient();
    this.appointmentService.getAllMedicalAppointments().subscribe({
      next: (appointments) => {
        this.medicalAppointments = appointments.data;
        this.applyFilters();
      },
      error: (err) => {
        this.toastr.warning('Erro ao carregar as consultas', 'Erro');
      },
    });
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.medicalAppointments];

    // Apply "Realizada" or "Não Realizada" filter
    if (this.filteredOption === AppointmentFilterOption.Realized) {
      filtered = filtered.filter(
        (appointment) => appointment.appointment.attended
      );
    } else if (this.filteredOption === AppointmentFilterOption.NotRealized) {
      filtered = filtered.filter(
        (appointment) => !appointment.appointment.attended
      );
    }

    // Search filter
    if (this.search.trim()) {
      const searchText = this.search.toLowerCase();
      filtered = filtered.filter((appointment) => {
        return Object.values(appointment).some((value) =>
          value?.toString().toLowerCase().includes(searchText)
        );
      });
    }

    // Order by date
    if (this.orderby) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.appointment.date).getTime();
        const dateB = new Date(b.appointment.date).getTime();
        return this.orderby === 'ASC' ? dateB - dateA : dateA - dateB;
      });
    }

    // Filter by sector (Public/Private)
    if (this.filterby) {
      filtered = filtered.filter((appointment) => {
        const isPublicSector =
          appointment.appointment?.institution?.isPublicSector;
        if (this.filterby === 'Public') {
          return isPublicSector === true;
        } else if (this.filterby === 'Private') {
          return isPublicSector === false;
        }
        return true;
      });
    }

    this.filteredAppointments = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(
      this.filteredAppointments.length / this.itemsPerPage
    );
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedAppointments = this.filteredAppointments.slice(
      startIndex,
      endIndex
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  viewDetails(appointmentId: string): void {
    this.router.navigate(['/dashboard/appointments', appointmentId]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  applyFilter(option: AppointmentFilterOption): void {
    this.filteredOption = option;
    this.currentPage = 1;
    this.applyFilters();
  }

  searchFilter(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  orderBy(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  filterBy(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
}
