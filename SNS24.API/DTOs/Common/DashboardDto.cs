using SNS24.Api.DTOs.Appointments;
using SNS24.Api.DTOs.MedicalAppointments;
using SNS24.Api.DTOs.MedicalLeavers;
using SNS24.Api.DTOs.Patients;
using SNS24.API.DTOs.Users;

namespace SNS24.API.DTOs.Common
{
    public class DashboardDto
    {
        public ApplicationUserDto User { get; set; }
        public IEnumerable<MedicalAppointmentResponseDto> Appointments { get; set; }
    }
}
