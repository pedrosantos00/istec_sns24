import { Component, OnInit } from '@angular/core';
import { InstitutionFilterOption } from '../../shared/enums/institutionsFilterOption';
import { Institution } from '../../shared/interfaces/institution';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterModule } from '@angular/router';
import {
  heroArrowDownOnSquare,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { InstitutionsService } from '../../shared/services/institutions/institutions.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIcon,
    RouterModule,
  ],
  viewProviders: [
    provideIcons({
      heroMagnifyingGlass,
      heroArrowDownOnSquare,
    }),
  ],
  styleUrls: ['./institutions.component.css'],
})
export class InstitutionsComponent implements OnInit {
  FilterOption = InstitutionFilterOption;
  institutions: Institution[] = [];
  filteredInstitutions: Institution[] = [];
  displayedInstitutions: Institution[] = [];

  search: string = '';
  filteredOption: InstitutionFilterOption = InstitutionFilterOption.All;

  constructor(private institutionsService: InstitutionsService) {}

  ngOnInit(): void {
    this.institutionsService.getInstitutions().subscribe((response) => {
      this.institutions = response.data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.institutions];

    if (this.filteredOption === InstitutionFilterOption.Public) {
      filtered = filtered.filter((institution) => institution.isPublicSector);
    } else if (this.filteredOption === InstitutionFilterOption.Private) {
      filtered = filtered.filter((institution) => !institution.isPublicSector);
    }

    if (this.search.trim()) {
      const searchText = this.search.toLowerCase();
      filtered = filtered.filter((institution) =>
        Object.values(institution).some((value) =>
          value?.toString().toLowerCase().includes(searchText)
        )
      );
    }

    this.filteredInstitutions = filtered;
    this.displayedInstitutions = this.filteredInstitutions;
  }

  applyFilter(option: InstitutionFilterOption): void {
    this.filteredOption = option;
    this.applyFilters();
  }

  searchFilter(): void {
    this.applyFilters();
  }
}
