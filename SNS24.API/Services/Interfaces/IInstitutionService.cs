using SNS24.Api.DTOs.Institutions;
using SNS24.API.Utilities;

namespace SNS24.Api.Services.Interfaces;

public interface IInstitutionService
{
    public Task<ApiResponse<IEnumerable<InstitutionResponseDto>>> GetAllAsync();
    
    public Task<ApiResponse<InstitutionResponseDto>> GetByIdAsync(Guid id);
    public Task<ApiResponse<IEnumerable<InstitutionResponseDto>>> GetFilteredAsync(Guid userId, string userRole);
}