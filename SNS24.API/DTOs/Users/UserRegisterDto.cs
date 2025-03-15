using SNS24.WebApi.Models;
using SNS24.WebApi.Models.Common;

namespace SNS24.Api.DTOs.Users;

public class UserRegisterDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Username { get; set; }
    public DateTime BirthDate { get; set; }
    public string DocumentNumber { get; set; }
    public string PhoneNumber { get; set; }
    public string Gender { get; set; }
    public Address Address { get; set; }
    public string Name { get; set; }

    public int Role { get; set; } 
    
    // needed for doctor 
    public string? LicenseNumber { get; set; }
    public string? Specialty { get; set; }
    public IEnumerable<Institution>? Institutions { get; set; } = new HashSet<Institution>();
    
    // needed for patient
    public string? SNSNumber { get; set; }
}