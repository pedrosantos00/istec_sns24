using SNS24.WebApi.Models.Common;

namespace SNS24.WebApi.Models
{
    public class Institution : BaseEntity
    {
        public string Name { get; set; }
        public Address Address { get; set; } = new Address();
        public string PhoneNumber { get; set; }
        public bool IsPublicSector { get; set; }
        public ICollection<Doctor> Doctors { get; set; } = new HashSet<Doctor>();
        public int? TotalDoctors => Doctors.Count;
    }
}