using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SNS24.Api.Services;
using SNS24.Api.Services.Interfaces;
using SNS24.API.Services.Interfaces;
using SNS24.WebApi.Controllers;
using SNS24.WebApi.Enums;

namespace SNS24.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalLeavesController : BaseController
    {
        private readonly IMedicalLeavesService _medicalLeavesService;
        public MedicalLeavesController(IMedicalLeavesService medicalLeavesService)
        {
            _medicalLeavesService = medicalLeavesService;
        }

        [HttpGet]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> GetAll(CancellationToken token)
        {
            var response = await _medicalLeavesService.GetAll(UserId, UserRole, token);

            return StatusCode((int)response.Code, response);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> Get(CancellationToken token, Guid id)
        {
            var response = await _medicalLeavesService.GetById(id, token);

            return StatusCode((int)response.Code, response);
        }
    }
}
