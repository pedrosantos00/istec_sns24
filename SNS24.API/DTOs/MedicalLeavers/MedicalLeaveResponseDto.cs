using SNS24.Api.DTOs.Doctors;
using SNS24.Api.DTOs.Patients;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models;

namespace SNS24.Api.DTOs.MedicalLeavers;

public class MedicalLeaveResponseDto
{
    public Guid? Id { get; set; }

    // fk
    public Guid? DoctorId { get; set; }
    public DoctorDto? Doctor { get; set; }
    public Guid? PatientId { get; set; }
    public PatientDto? Patient { get; set; }

    public string? Diagnosis { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Recommendations { get; set; }

    public bool? IsPublicSector { get; set; }

    public string? Employer { get; set; }
    public string? JobFunction { get; set; }
    public string? EducationLevel { get; set; }

    public MedicalLeaveStatus? Status { get; set; }

    public DateTime? Created { get; set; }
    public DateTime? Updated { get; set; }
}