using SNS24.Api.DTOs.Appointments;
using SNS24.Api.DTOs.MedicalAppointments;
using SNS24.Api.DTOs.MedicalLeavers;

namespace SNS24.API.DTOs.Common
{
    public class NotificationDto
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime NotificationDate { get; set; }
    }
}
