using SNS24.WebApi.Models;

namespace SNS24.Api.Models.Appointments;

public class Appointment : BaseEntity
{
    public DateTime Date { get; set; }
    public bool Attended { get; set; }

    // fk
    public Guid? DoctorId { get; set; }
    public Doctor? Doctor { get; set; }

    public Guid PatientId { get; set; }
    public Patient Patient { get; set; }

    public Guid InstitutionId { get; set; }
    public Institution? Institution { get; set; }
}