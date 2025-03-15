using SNS24.Api.DTOs.Doctors;
using SNS24.Api.DTOs.Institutions;
using SNS24.Api.DTOs.Patients;
using SNS24.API.DTOs.Institutions;
using SNS24.WebApi.Models;

namespace SNS24.Api.DTOs.Appointments;

public class AppointmentResponseDto
{
    public Guid? Id { get; set; }

    public DateTime? Date { get; set; }
    public bool? Attended { get; set; }

    // fk
    public Guid? DoctorId { get; set; }
    public Guid? PatientId { get; set; }
    public Guid? InstitutionId { get; set; }
    public InstitutionDto? Institution { get; set; }

    public DateTime? Created { get; set; }
    public DateTime? Updated { get; set; }
}