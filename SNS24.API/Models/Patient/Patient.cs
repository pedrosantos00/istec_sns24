using SNS24.API.Models.Common;

namespace SNS24.WebApi.Models
{
    public class Patient : ApplicationUser
    {
        public string SNSNumber { get; set; }
        public ICollection<MedicalLeave> MedicalLeaves { get; set; } = new HashSet<MedicalLeave>();
        public Patient()
        {
            Role = Enums.Role.Patient;
        }
    }
}
