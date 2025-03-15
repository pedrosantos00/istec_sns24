namespace SNS24.Api.DTOs.Appointments;

public class AppointmentCreateDto
{
    public DateTime Date { get; set; }

    public bool Attended { get; } = false;

    public Guid DoctorId { get; set; }

    public Guid PatientId { get; set; }
}