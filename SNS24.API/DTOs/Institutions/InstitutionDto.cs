using SNS24.API.DTOs.Address;

namespace SNS24.API.DTOs.Institutions
{
    public class InstitutionDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? IsPublicSector { get; set; }
        public int? TotalDoctors { get; set; } = 0;
    }
}
