/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MedicalAppointmentService } from './medicalAppointment.service';

describe('Service: MedicalAppointment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedicalAppointmentService]
    });
  });

  it('should ...', inject([MedicalAppointmentService], (service: MedicalAppointmentService) => {
    expect(service).toBeTruthy();
  }));
});
