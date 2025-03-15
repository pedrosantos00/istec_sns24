using SNS24.API.DTOs.Users;

namespace SNS24.Api.DTOs.Patients;

public class PatientDto : ApplicationUserDto
{
    public Guid? Id { get; set; }
    public string? SNSNumber { get; set; }
}