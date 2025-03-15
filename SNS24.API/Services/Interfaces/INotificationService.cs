using System.Threading.Tasks;

namespace SNS24.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task NotifyAppointmentCreatedAsync(Guid userId, DateTime appointmentDate, string location);
        Task NotifyMedicalLeaveCreatedAsync(Guid userId, DateTime startDate, DateTime endDate);
        Task NotifyExpiringMedicalLeaveAsync(Guid userId, DateTime expirationDate);
        Task NotifyExpiredMedicalLeaveAsync(Guid userId);
        Task NotifyAccountCreatedAsync(Guid userId);
        Task NotifySystemAnnouncementAsync(Guid userId, string announcementDetails);
    }
}
