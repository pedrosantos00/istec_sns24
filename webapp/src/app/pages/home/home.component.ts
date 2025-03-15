import { Notification } from './../../shared/interfaces/user/notification';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBellAlert,
  heroCalendar,
  heroClipboardDocumentList,
  heroHeart,
} from '@ng-icons/heroicons/outline';
import { ionMedical } from '@ng-icons/ionicons';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { CalendarEventDto } from '../../shared/dtos/calendarEventDto';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';
import { ImcCalculatorComponent } from '../../shared/components/imcCalculator/imcCalculator.component';
import DiabetesCalculatorComponent from '../../shared/components/diabetesCalculator/diabetesCalculator.component';
import { RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user/user.service';
import { Dashboard } from '../../shared/interfaces/common/dashboard';
import { MedicalLeave } from '../../shared/interfaces/medical-appointment/medical-leave';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    NgIcon,
    CalendarComponent,
    ImcCalculatorComponent,
    DiabetesCalculatorComponent,
    RouterModule,
  ],
  viewProviders: [
    provideIcons({
      heroCalendar,
      ionMedical,
      heroClipboardDocumentList,
      heroHeart,
      heroBellAlert,
    }),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  showImcModal: boolean = false;
  showDiabetesModal: boolean = false;
  dashboard?: Dashboard;
  calendarEvents: CalendarEventDto[] = [];
  isPacient: boolean = false;

   limitedAppointments: any[] = [];
   limitedNotifications: any[] = [];
   limitedMedicalLeaves: MedicalLeave[] = [];

  constructor(
    private jwtService: JWTTokenService,
    private usersService: UserService
  ) {
    this.isPacient = this.jwtService.isPacient();
  }

  ngOnInit(): void {
    this.usersService.getDashboard().subscribe((response) => {
      this.dashboard = response.data;

      this.limitedAppointments = this.dashboard?.appointments?.slice(0, 3) || [];
      this.limitedNotifications = this.dashboard?.user?.notifications?.slice(0, 3) || [];
      this.limitedMedicalLeaves = this.dashboard?.appointments
        ?.map((appt) => appt.medicalLeave)
        .filter((leave) => leave !== undefined)
        .slice(0, 3) || [];

      this.populateCalendarEvents();
    });
  }

  currentDate: Date = new Date();

  populateCalendarEvents(): void {
    if (this.dashboard?.appointments) {
      this.calendarEvents = this.dashboard.appointments.map((appointment) => ({
        id: appointment.id,
        title: appointment.reasonForVisit,
        date: new Date(appointment.appointment.date),
      }));
    }
  }

  openImcCalculator(): void {
    this.showImcModal = true;
  }

  openDiabetesCalculator(): void {
    this.showDiabetesModal = true;
  }

  closeModal(): void {
    this.showImcModal = false;
    this.showDiabetesModal = false;
  }
}
