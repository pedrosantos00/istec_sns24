using SNS24.Api.Models.Appointments;
using SNS24.WebApi.Models;

namespace SNS24.Api.Models.MedicalAppointment;

public class MedicalAppointment : BaseEntity
{
    public string ReasonForVisit { get; set; }
    public string AppointmentType { get; set; }
    public string Specialty { get; set; }
    public string Symptoms { get; set; }
    public string Diagnosis { get; set; }
    public string Prescription { get; set; }

    // foreign keys
    public Appointment Appointment { get; set; }
    public MedicalLeave? MedicalLeave { get; set; }
}