using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.Models.Files;
using SNS24.API.Utilities;

namespace SNS24.Api.Services.Interfaces;

public interface IStoredFileService
{
    public Task<ApiResponse<StoredFileResponseDto>> SaveFileAsync(StoredFile file);
    public Task<StoredFile?> DownloadFileAsync(Guid fileId);
}