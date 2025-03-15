using System.Net;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.Mappers;
using SNS24.Api.Models.Files;
using SNS24.Api.Services.Interfaces;
using SNS24.API.Utilities;
using SNS24.WebApi.Data;

namespace SNS24.Api.Services;

public class StoredFileService : IStoredFileService
{
    private readonly ApplicationDbContext _context;
    private readonly ObjectMapper _mapper;

    public StoredFileService(ApplicationDbContext context, ObjectMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<StoredFileResponseDto>> SaveFileAsync(StoredFile file)
    {
        _context.StoredFiles.Add(file);

        if (await _context.SaveChangesAsync() <= 0)
        {
            return ApiResponse<StoredFileResponseDto>.Error(HttpStatusCode.BadRequest,
                "Ocorreu um erro ao criar o ficheiro, tente novamente mais tarde");
        }

        var dto = _mapper.StoredFileToStoredFileResponseDto(file);

        return ApiResponse<StoredFileResponseDto>.Success(dto);
    }

    public async Task<StoredFile?> DownloadFileAsync(Guid fileId)
    {
        var file = await _context.StoredFiles.FirstOrDefaultAsync(f => f.Id == fileId);

        return file;
    }
}