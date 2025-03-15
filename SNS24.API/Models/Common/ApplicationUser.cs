using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SNS24.Api.Models.Files;
using SNS24.API.Models.Common;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models.Common;

namespace SNS24.WebApi.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string Name { get; set; }
        public string Gender { get; set; }
        public string DocumentNumber { get; set; }
        public Address Address { get; set; } = new Address();
        public DateTime BirthDate { get; set; }
        public Role Role { get; set; }
        public DateTime Created { get; private set; } = DateTime.UtcNow;
        public DateTime Updated { get; set; }
        public StoredFile? ProfilePicture { get; set; }
        public ICollection<Notification> Notifications { get; set; } = new HashSet<Notification>();
    }
}