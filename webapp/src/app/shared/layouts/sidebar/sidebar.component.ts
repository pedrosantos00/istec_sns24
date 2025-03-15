import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeftStartOnRectangleSolid } from '@ng-icons/heroicons/solid';
import {
  heroIdentification,
  heroCalendarDays,
  heroChevronLeft,
  heroChevronRight,
  heroHome,
} from '@ng-icons/heroicons/outline';
import {
  matDashboardOutline,
  matMedicalInformationOutline,
} from '@ng-icons/material-icons/outline';
import { UserPictureService } from '../../services/userPictureProfile/user-picture-service';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, NgIcon, RouterLink, RouterLinkActive],
  viewProviders: provideIcons({
    matDashboardOutline,
    heroChevronLeft,
    heroHome,
    heroChevronRight,
    matMedicalInformationOutline,
    heroIdentification,
    heroCalendarDays,
    heroArrowLeftStartOnRectangleSolid,
  }),
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  isExpanded = true;
  screenSize: string = 'md'; // Default screen size

  constructor(private router: Router, private pictureService : UserPictureService) {}

  ngOnInit(): void {
    this.checkScreenSize(window.innerWidth);
  }

  sidebars: SideBarConfig[] = [
    {
      title: 'Pagina Principal',
      icon: 'matDashboardOutline',
      route: '/dashboard',
    },
    {
      title: 'Consultas',
      icon: 'heroCalendarDays',
      route: 'appointments',
    },
    {
      title: 'Baixas Médicas',
      icon: 'matMedicalInformationOutline',
      route: 'sick-leaves',
    },
  ];

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  private checkScreenSize(width: number): void {
    this.screenSize = width < 768 ? 'sm' : 'md';
    this.isExpanded = this.screenSize === 'md';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    const width = event.target.innerWidth;
    this.screenSize = width < 768 ? 'sm' : 'md';
    if (this.screenSize === 'sm') {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    this.pictureService.updatePicture(undefined);
    this.router.navigate(['']);
  }
}

interface SideBarConfig {
  title: string;
  icon: string;
  route: string;
}
