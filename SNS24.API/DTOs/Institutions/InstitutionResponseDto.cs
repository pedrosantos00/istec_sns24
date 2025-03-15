using SNS24.Api.DTOs.Doctors;
using SNS24.API.DTOs.Address;
using SNS24.WebApi.Models;
using SNS24.WebApi.Models.Common;

namespace SNS24.Api.DTOs.Institutions;

public class InstitutionResponseDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public AddressResponseDto? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public bool? IsPublicSector { get; set; }
    public int? TotalDoctors { get; set; } = 0;
}