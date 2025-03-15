using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.Models.Files;
using SNS24.API.DTOs.Address;
using SNS24.API.DTOs.Common;
using SNS24.WebApi.Enums;

namespace SNS24.API.DTOs.Users
{
    public class ApplicationUserDto
    {
        public string? Name { get; set; }
        public string? Gender { get; set; }
        public string? DocumentNumber { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public AddressResponseDto? Address { get; set; }
        public StoredFileResponseDto? ProfilePicture { get; set; }
        public List<NotificationDto>? Notifications { get; set; }
        public DateTime? BirthDate { get; set; }
        public Role? Role { get; set; }
    }
}
