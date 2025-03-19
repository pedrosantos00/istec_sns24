using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SNS24.Api.DTOs.Doctors;
using SNS24.Api.DTOs.Patients;
using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.DTOs.Users;
using SNS24.Api.Mappers;
using SNS24.Api.Services;
using SNS24.Api.Services.Interfaces;
using SNS24.API.DTOs.Users;
using SNS24.API.Utilities;
using SNS24.WebApi.Controllers;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Utilities.Authorization;
using System.Net;

namespace SNS24.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly IApplicationUserService _applicationUserService;
        private readonly ObjectMapper _mapper;
        private readonly JwtTokenGenerator _jwtTokenGenerator;
        private readonly EmailService _emailService;

        public UsersController(ObjectMapper mapper, IApplicationUserService applicationUserService,
            JwtTokenGenerator jwtTokenGenerator, EmailService emailService)
        {
            _applicationUserService = applicationUserService;
            _mapper = mapper;
            _jwtTokenGenerator = jwtTokenGenerator;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            if (request.Role == (int)Role.Doctor)
            {
                var doc = _mapper.UserRegisterDtoToDoctor(request);

                var response = await _applicationUserService.CreateDoctorAsync(doc, request.Password);

                return StatusCode((int)response.Code, response);
            }
            else
            {
                var patient = _mapper.UserRegisterDtoToPatient(request);

                var response = await _applicationUserService.CreatePatientAsync(patient, request.Password);

                return StatusCode((int)response.Code, response);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto request)
        {
            var user = await _applicationUserService.FindByDocumentNumberAsync(request.DocumentNumber);

            if (user is null)
            {
                return StatusCode((int)HttpStatusCode.BadRequest,
                    ApiResponse<bool>.Error(HttpStatusCode.BadRequest, "Credênciais inválidas"));
            }

            if (!user.EmailConfirmed)
            {
                return StatusCode((int)HttpStatusCode.BadRequest,
                    ApiResponse<bool>.Error(HttpStatusCode.BadRequest,
                        "Verificação de conta necessária para proceder. Verifique a caixa de entrada do seu email."));
            }

            var login = _applicationUserService.ValidateCredentials(user, request.Password);

            if (!login)
            {
                return StatusCode((int)HttpStatusCode.BadRequest,
                    ApiResponse<bool>.Error(HttpStatusCode.BadRequest, "Credênciais inválidas"));
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            return Ok(new { token });
        }

        [HttpGet("dashboard")]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> GetDashboard(CancellationToken token)
        {
            var response = await _applicationUserService.GetDashboardAsync(UserId,token);
            return StatusCode((int)response.Code, response);
        }


        [HttpGet("patients")]
        [Authorize(Policy = nameof(Role.Doctor))]
        public async Task<IActionResult> GetPatients(CancellationToken token)
        {
            var response = await _applicationUserService.GetPatientsAsync(token);
            return StatusCode((int)response.Code, response);
        }

        [HttpGet()]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> GetUser()
        {
            if (UserRole is null || UserId == Guid.Empty)
            {
                return BadRequest("Role ou Sub Claims inválidas");
            }

            if (UserRole == nameof(Role.Patient))
            {
                var patient = await _applicationUserService.GetPatientAsync(UserId);
                return StatusCode((int)patient.Code, patient);
            }

            if (UserRole == nameof(Role.Doctor))
            {
                var doctor = await _applicationUserService.GetDoctorAsync(UserId);
                return StatusCode((int)doctor.Code, doctor);
            }

            return BadRequest("Não foi possivel encontrar o utilizador");
        }

        [HttpGet("{id}")]
        [Authorize(Policy = nameof(Role.Admin))]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var response = await _applicationUserService.GetById(id);

            return StatusCode((int)response.Code, response);
        }

        [HttpPost("patient")]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> UpdatePatient(PatientDto model)
        {
            var response = await _applicationUserService.UpdatePatientAsync(model);

            return StatusCode((int)response.Code, response);
        }

        [HttpPost("doctor")]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> UpdateDoctor(DoctorDto model)
        {
            var response = await _applicationUserService.UpdateDoctorAsync(model);

            return StatusCode((int)response.Code, response);
        }

        [HttpPost("change-picture")]
        [Authorize(Policy = nameof(Role.Patient))]
        public async Task<IActionResult> UploadPicture(StoredFileRequestDto request)
        {
            var response = await _applicationUserService.ChangeProfilePictureAsync(request);

            return StatusCode((int)response.Code, response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            var response = await _applicationUserService.ForgotPassword(request);

            return StatusCode((int)response.Code, response);
        }

        [HttpGet("account/confirmation")]
        public async Task<IActionResult> ConfirmAccount([FromHeader] string email, [FromHeader] string token)
        {
            var response = await _applicationUserService.ConfirmAccount(token, email);

            return StatusCode((int)response.Code, response);
        }

        [HttpPost("account/confirmation")]
        public async Task<IActionResult> SendEmailConfirmation(ResendAccountConfirmationDto request)
        {
            if (request.Email is null)
            {
                return StatusCode((int)HttpStatusCode.BadRequest,
                    ApiResponse<bool>.Error(HttpStatusCode.BadRequest,
                        "Email inválido"));
            }

            var response = await _applicationUserService.SendAccountConfirmationAsync(request.Email);

            return StatusCode((int)response.Code, response);
        }
    }
}