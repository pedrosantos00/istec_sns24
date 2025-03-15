using SNS24.Api.DTOs.Doctors;
using SNS24.Api.DTOs.Patients;
using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.DTOs.Users;
using SNS24.API.DTOs.Common;
using SNS24.API.DTOs.Users;
using SNS24.API.Utilities;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models;

namespace SNS24.Api.Services.Interfaces;

public interface IApplicationUserService
{
    public Task<ApiResponse<DoctorDto>> CreateDoctorAsync(Doctor applicationUser, string password);
    public Task<ApiResponse<PatientDto>> CreatePatientAsync(Patient patient, string password);
    public Task<ApplicationUser> FindByDocumentNumberAsync(string email);
    Task<ApiResponse<StoredFileResponseDto>> ChangeProfilePictureAsync(StoredFileRequestDto request);
    Task<ApiResponse<List<PatientDto>>> GetPatientsAsync(CancellationToken token);
    Task<ApiResponse<PatientDto>> GetPatientAsync(Guid userId);
    Task<ApiResponse<DoctorDto>> GetDoctorAsync(Guid userId);
    Task<ApiResponse<PatientDto>> UpdatePatientAsync(PatientDto model);
    Task<ApiResponse<DoctorDto>> UpdateDoctorAsync(DoctorDto model);
    Task<ApiResponse<DashboardDto>> GetDashboardAsync(Guid userId, CancellationToken token);
    public bool ValidateCredentials(ApplicationUser user, string password);
    public Task<ApiResponse<ApplicationUser>> GetById(Guid id);
    public Task<ApiResponse<bool>> ForgotPassword(ForgotPasswordRequestDto request);
    public Task<ApiResponse<bool>> SendAccountConfirmationAsync(string email);
    public Task<ApiResponse<bool>> ConfirmAccount(string token, string email);
}