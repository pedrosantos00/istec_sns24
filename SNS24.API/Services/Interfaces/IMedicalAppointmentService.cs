using SNS24.Api.DTOs.MedicalAppointments;
using SNS24.Api.Models.MedicalAppointment;
using SNS24.API.Utilities;

namespace SNS24.Api.Services.Interfaces;

public interface IMedicalAppointmentService
{
    public Task<ApiResponse<MedicalAppointmentResponseDto>> Create(MedicalAppointment medicalAppointment, Guid userId, CancellationToken token);
    public Task<ApiResponse<MedicalAppointmentResponseDto>> Update(MedicalAppointment medicalAppointment, Guid userId, CancellationToken token);
    public Task<ApiResponse<IEnumerable<MedicalAppointmentResponseDto>>> GetAll(string role, Guid UserId, CancellationToken token);
    public Task<ApiResponse<MedicalAppointmentResponseDto>> GetById(CancellationToken token, Guid id);
    public Task<ApiResponse<bool>> Delete(CancellationToken token, Guid id);
}