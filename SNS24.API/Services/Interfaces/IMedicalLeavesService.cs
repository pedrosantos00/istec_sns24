using SNS24.Api.DTOs.MedicalLeavers;
using SNS24.API.Utilities;
using SNS24.WebApi.Enums;

namespace SNS24.API.Services.Interfaces
{
    public interface IMedicalLeavesService
    {
        Task<ApiResponse<List<MedicalLeaveResponseDto>>> GetAll(Guid userId, string role, CancellationToken token);
        Task<ApiResponse<MedicalLeaveResponseDto>> GetById(Guid leaveId, CancellationToken token);
    }
}
