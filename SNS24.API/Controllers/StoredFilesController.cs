using System.Net;
using Microsoft.AspNetCore.Mvc;
using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.Mappers;
using SNS24.Api.Services.Interfaces;
using SNS24.API.Utilities;
using SNS24.WebApi.Controllers;

namespace SNS24.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StoredFilesController : BaseController
{
    private readonly IStoredFileService _storedFileService;
    private readonly ObjectMapper _mapper;

    public StoredFilesController(IStoredFileService storedFileService, ObjectMapper mapper)
    {
        _storedFileService = storedFileService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> AddFile(StoredFileRequestDto request)
    {
        var storedFile = _mapper.StoredFileRequestDtoToStoredFile(request);

        if (request is null)
        {
            return StatusCode((int)HttpStatusCode.BadRequest,
                ApiResponse<StoredFileResponseDto>.Error(HttpStatusCode.BadRequest, ""));
        }

        var response = await _storedFileService.SaveFileAsync(storedFile);

        return StatusCode((int)response.Code, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> DownloadFile(Guid id)
    {
        var file = await _storedFileService.DownloadFileAsync(id);

        if (file is null)
        {
            return StatusCode((int)HttpStatusCode.NotFound,
                ApiResponse<StoredFileResponseDto>.Error(HttpStatusCode.NotFound,
                    "Não foi possível encontrar nenhum ficheiro com o ID recebido."));
        }

        return File(file.Content, file.MimeType);
    }
}