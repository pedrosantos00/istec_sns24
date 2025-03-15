import { Component, OnInit } from '@angular/core';
import {
  MedicalLeave,
  MedicalLeaveStatus,
} from '../../shared/interfaces/medical-appointment/medical-leave';
import { MedicalAppointmentService } from '../../shared/services/medical-appointment/medicalAppointment.service';
import { FilterOption } from '../../shared/enums/filterOption';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowDownOnSquare,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { PdfService } from '../../shared/services/pdf/pdf.service';
import { MedicalLeaveService } from '../../shared/services/medical-leave/medical-leave.service';

@Component({
  selector: 'app-sick-leaves',
  templateUrl: './sick-leaves.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIcon],
  viewProviders: [
    provideIcons({
      heroMagnifyingGlass,
      heroArrowDownOnSquare,
    }),
  ],
  styleUrls: ['./sick-leaves.component.scss'],
})
export class SickLeavesComponent implements OnInit {
  FilterOption = FilterOption;
  medicalLeaves: MedicalLeave[] = [];
  allFilteredMedicalLeaves: MedicalLeave[] = [];
  displayedMedicalLeaves: MedicalLeave[] = [];

  filteredOption: FilterOption = FilterOption.All;
  orderby: string = '';
  search: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(
    private leavesService: MedicalLeaveService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.leavesService.getAll().subscribe((response) => {
      console.log(response.data);
      this.medicalLeaves = response.data;
      this.applyFilters();
    });
  }

  getMedicalLeaves() {}

  applyFilters(): void {
    let filtered = [...this.medicalLeaves];

    if (this.filteredOption === FilterOption.Active) {
      filtered = filtered.filter(
        (leave) => leave.status == MedicalLeaveStatus.Active
      );
    } else if (this.filteredOption === FilterOption.Expired) {
      filtered = filtered.filter(
        (leave) => leave.status == MedicalLeaveStatus.Expired
      );
    }

    if (this.search.trim()) {
      const searchText = this.search.toLowerCase();
      filtered = filtered.filter((leave) =>
        [
          leave.diagnosis,
          leave.doctor?.name,
          leave.doctor?.specialty,
          leave.recommendations,
        ].some((field) => field?.toLowerCase().includes(searchText))
      );
    }

    if (this.orderby) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.startDate ?? new Date()).getTime();
        const dateB = new Date(b.startDate ?? new Date()).getTime();
        return this.orderby === 'ASC' ? dateA - dateB : dateB - dateA;
      });
    }

    this.allFilteredMedicalLeaves = filtered;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(
      this.allFilteredMedicalLeaves.length / this.itemsPerPage
    );
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedMedicalLeaves = this.allFilteredMedicalLeaves.slice(
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

  generatePdf(leave: MedicalLeave): void {
    if (leave) {
      this.pdfService.generateMedicalLeavePdf(leave);
    }
  }

  applyFilter(option: FilterOption): void {
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
}
