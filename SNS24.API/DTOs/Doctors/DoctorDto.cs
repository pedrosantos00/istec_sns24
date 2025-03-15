using SNS24.Api.DTOs.Institutions;
using SNS24.API.DTOs.Address;
using SNS24.API.DTOs.Users;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models.Common;

namespace SNS24.Api.DTOs.Doctors;

public class DoctorDto : ApplicationUserDto
{
    public string? LicenseNumber { get; set; }
    public string? Specialty { get; set; }
    public ICollection<InstitutionResponseDto>? Institutions { get; set; } = new HashSet<InstitutionResponseDto>();
}