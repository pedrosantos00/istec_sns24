import { MedicalLeave } from './../../interfaces/medical-appointment/medical-leave';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { MedicalAppointment } from '../../interfaces/medical-appointment/medical-appointment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  generateMedicalLeavePdf(leave: MedicalLeave): void {
    const doc = new jsPDF();

    // Add SNS logo
    const logoPath = 'assets/img/sns_icon.png';
    doc.addImage(logoPath, 'PNG', 10, 10, 30, 30);

    // Title
    doc.setFontSize(20);
    doc.setTextColor('#1D4ED8');
    doc.text('Detalhes da Baixa Médica', 50, 20);

    doc.setDrawColor('#1D4ED8');
    doc.line(10, 45, 200, 45);

    // Medical Leave Details
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text('Informações da Baixa Médica', 10, 55);

    doc.setFontSize(10);
    doc.text(`ID da Baixa Médica: ${leave.id}`, 10, 65);
    doc.text(`Paciente: ${leave?.patient?.name}`, 10, 75);
    doc.text(`Médico: ${leave?.doctor?.name}`, 10, 85);
    doc.text(`Especialidade do Médico: ${leave?.doctor?.specialty}`, 10, 95);
    doc.text(`Diagnóstico: ${leave.diagnosis}`, 10, 105);
    doc.text(
      `Data Início: ${new Date(
        leave?.startDate ?? Date.now()
      ).toLocaleDateString()}`,
      10,
      115
    );
    doc.text(
      `Data Alta: ${new Date(
        leave?.endDate ?? Date.now()
      ).toLocaleDateString()}`,
      10,
      125
    );
    doc.text(`Empregador: ${leave.employer}`, 10, 145);
    doc.text(`Função no Trabalho: ${leave.jobFunction}`, 10, 155);
    doc.text(`Nível Educacional: ${leave.educationLevel}`, 10, 165);
    doc.text(`Recomendações: ${leave.recommendations}`, 10, 175);

    // Footer
    doc.setDrawColor('#D1D5DB');
    doc.line(10, 280, 200, 280);
    doc.setFontSize(10);
    doc.setTextColor('#6B7280');
    doc.text('Sistema Nacional de Saúde', 10, 290);

    doc.save('Detalhes_Baixa_Medica.pdf');
  }

  generateAppointmentPdf(appointment: MedicalAppointment): void {
    const doc = new jsPDF();

    // Add SNS logo
    const logoPath = 'assets/img/sns_icon.png';
    doc.addImage(logoPath, 'PNG', 10, 10, 30, 30);

    // Title
    doc.setFontSize(20);
    doc.setTextColor('#000000'); // Black for the title
    doc.text('Detalhes da Consulta', 50, 20);

    doc.setDrawColor('#000000'); // Black for line
    doc.line(10, 45, 200, 45);

    // Appointment Details
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text('Informações da Consulta', 10, 55);

    doc.setFontSize(10);
    doc.text(`Razão: ${appointment.reasonForVisit}`, 10, 65);
    doc.text(`Tipo: ${appointment.appointmentType}`, 10, 75);
    doc.text(`Especialidade: ${appointment.specialty}`, 10, 85);
    doc.text(`Sintomas: ${appointment.symptoms}`, 10, 95);
    doc.text(`Diagnóstico: ${appointment.diagnosis}`, 10, 105);
    doc.text(`Prescrição: ${appointment.prescription}`, 10, 115);
    doc.text(
      `Data da Consulta: ${new Date(
        appointment.appointment.date
      ).toLocaleDateString()}`,
      10,
      125
    );

    // Draw a separator line before Medical Leave section
    doc.line(10, 135, 200, 135);

    // Associated Medical Leave
    if (appointment.medicalLeave) {
      const leave = appointment.medicalLeave;

      doc.setFontSize(12);
      doc.text('Baixa Médica Associada', 10, 145);

      doc.setFontSize(10);
      doc.text(`ID da Baixa Médica: ${leave.id}`, 10, 155);
      doc.text(`Médico: ${leave.doctor?.name}`, 10, 165);
      doc.text(`Especialidade do Médico: ${leave.doctor?.specialty}`, 10, 175);
      doc.text(`Diagnóstico: ${leave.diagnosis}`, 10, 185);
      doc.text(
        `Data Início: ${new Date(leave.startDate ?? new Date()).toLocaleDateString()}`,
        10,
        195
      );
      doc.text(
        `Data Alta: ${new Date(leave.endDate?? new Date()).toLocaleDateString()}`,
        10,
        205
      );
      doc.text(`Recomendações: ${leave.recommendations}`, 10, 225);
    }

    // Footer
    doc.setDrawColor('#D1D5DB');
    doc.line(10, 280, 200, 280);
    doc.setFontSize(10);
    doc.setTextColor('#6B7280');
    doc.text('Sistema Nacional de Saúde', 10, 290);

    doc.save('Detalhes_Consulta.pdf');
  }
}
