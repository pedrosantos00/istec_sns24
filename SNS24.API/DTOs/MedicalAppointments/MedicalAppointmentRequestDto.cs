using SNS24.Api.DTOs.Appointments;
using SNS24.Api.DTOs.MedicalLeavers;

namespace SNS24.Api.DTOs.MedicalAppointments;

public class MedicalAppointmentRequestDto
{
    public Guid? Id { get; set; }
    public string? ReasonForVisit { get; set; } = "-";
    public string? AppointmentType { get; set; } = "-";
    public string? Specialty { get; set; } = "-";
    public string? Symptoms { get; set; } = "-";
    public string? Diagnosis { get; set; } = "-";
    public string? Prescription { get; set; } = "-";

    // foreign keys
    public AppointmentRequestDto? Appointment { get; set; }
    public MedicalLeaveRequestDto? MedicalLeave { get; set; }
}