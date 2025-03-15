import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicalAppointment } from '../../shared/interfaces/medical-appointment/medical-appointment';
import { MedicalAppointmentService } from '../../shared/services/medical-appointment/medicalAppointment.service';
import { PdfService } from '../../shared/services/pdf/pdf.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';

@Component({
  selector: 'app-appointment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ButtonComponent,RouterModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})

export class AppointmentComponent implements OnInit {
  medicalAppointment: MedicalAppointment | undefined;
  isPacient: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: MedicalAppointmentService,
    private pdfService: PdfService,
    private jwtService: JWTTokenService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
     this.appointmentService.getAppointmentById(id).subscribe((appointment) => {
      this.medicalAppointment = appointment.data;
     });
    }
    this.isPacient = this.jwtService.isPacient();
  }

  generatePdf(): void {
    if (this.medicalAppointment) {
      this.pdfService.generateAppointmentPdf(this.medicalAppointment);
    }
  }
}
