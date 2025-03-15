using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SNS24.Api.Services.Interfaces;
using SNS24.WebApi.Controllers;

namespace SNS24.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InstitutionsController : BaseController
{
    private readonly IInstitutionService _institutionService;

    public InstitutionsController(IInstitutionService institutionService)
    {
        _institutionService = institutionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = await _institutionService.GetAllAsync();

        return StatusCode((int)response.Code, response);
    }


    [HttpGet("filter")]
    [Authorize]
    public async Task<IActionResult> GetFilter()
    {
        var response = await _institutionService.GetFilteredAsync(UserId, UserRole);

        return StatusCode((int)response.Code, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAll(Guid id)
    {
        var response = await _institutionService.GetByIdAsync(id);

        return StatusCode((int)response.Code, response);
    }
}