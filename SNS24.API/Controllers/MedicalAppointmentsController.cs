using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SNS24.Api.DTOs.MedicalAppointments;
using SNS24.Api.Mappers;
using SNS24.Api.Services.Interfaces;
using SNS24.WebApi.Controllers;
using SNS24.WebApi.Enums;
using System.Security.Claims;

namespace SNS24.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalAppointmentsController : BaseController
    {
        private readonly ObjectMapper _mapper;
        private readonly IMedicalAppointmentService _medicalAppointmentService;

        public MedicalAppointmentsController(ObjectMapper mapper, IMedicalAppointmentService medicalAppointmentService)
        {
            _mapper = mapper;
            _medicalAppointmentService = medicalAppointmentService;
        }

        [HttpPost]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> Create(MedicalAppointmentRequestDto request, CancellationToken token)
        {
            var medicalAppointment = _mapper.MedicalAppointmentRequestDtoToMedicalAppointment(request);

            var response = await _medicalAppointmentService.Create(medicalAppointment, UserId, token);

            return StatusCode((int)response.Code, response);
        }

        [HttpPut]
        [Authorize(Policy = nameof(Role.Doctor))]
        public async Task<IActionResult> Update(MedicalAppointmentRequestDto request, CancellationToken token)
        {
            var medicalAppointment = _mapper.MedicalAppointmentRequestDtoToMedicalAppointment(request);

            var response = await _medicalAppointmentService.Update(medicalAppointment, UserId, token);

            return StatusCode((int)response.Code, response);
        }

        [HttpGet]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> GetAll(CancellationToken token)
        {
            var response = await _medicalAppointmentService.GetAll(UserRole, UserId, token);

            return StatusCode((int)response.Code, response);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> Get(CancellationToken token, Guid id)
        {
            var response = await _medicalAppointmentService.GetById(token, id);

            return StatusCode((int)response.Code, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> Delete(CancellationToken token, Guid id)
        {
            var response = await _medicalAppointmentService.Delete(token, id);

            return StatusCode((int)response.Code, response);
        }
    }
}