using SNS24.Api.DTOs.Institutions;
using SNS24.WebApi.Models;

namespace SNS24.Api.DTOs.Appointments;

public class AppointmentRequestDto
{
    public Guid? Id { get; set; }
    
    public DateTime? Date { get; set; }
    public bool? Attended { get; set; }

    // fk
    public Guid? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }

    public Guid? PatientId { get; set; }
    public Patient? Patient { get; set; }

    public Guid? InstitutionId { get; set; }
    public InstitutionResponseDto? Institution { get; set; }
}