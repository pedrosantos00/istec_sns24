using SNS24.Api.DTOs.Appointments;
using SNS24.Api.DTOs.MedicalLeavers;

namespace SNS24.Api.DTOs.MedicalAppointments;

public class MedicalAppointmentResponseDto
{
    public Guid? Id { get; set; }
    public string? ReasonForVisit { get; set; }
    public string? AppointmentType { get; set; }
    public string? Specialty { get; set; }
    public string? Symptoms { get; set; }
    public string? Diagnosis { get; set; }
    public string? Prescription { get; set; }

    // foreign keys
    public AppointmentResponseDto? Appointment { get; set; }
    public MedicalLeaveResponseDto? MedicalLeave { get; set; }

    public DateTime? Created { get; set; }
    public DateTime? Updated { get; set; }
}