using SNS24.WebApi.Models;

namespace SNS24.API.Models.Common
{
    public class Notification : BaseEntity
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime NotificationDate { get; set; }

        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
