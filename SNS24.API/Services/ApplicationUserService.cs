using System.IO.IsolatedStorage;
using System.Net;
using System.Numerics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NuGet.Versioning;
using SNS24.Api.DTOs.Doctors;
using SNS24.Api.DTOs.Patients;
using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.DTOs.Users;
using SNS24.Api.Mappers;
using SNS24.Api.Models.MedicalAppointment;
using SNS24.Api.Services.Interfaces;
using SNS24.API.DTOs.Common;
using SNS24.API.DTOs.Users;
using SNS24.API.Utilities;
using SNS24.WebApi.Data;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models;

namespace SNS24.Api.Services;

public class ApplicationUserService : IApplicationUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;
    private readonly ApplicationDbContext _context;
    private readonly ObjectMapper _mapper;

    public ApplicationUserService(UserManager<ApplicationUser> userManager, ObjectMapper mapper,
        ApplicationDbContext context, EmailService emailService, IConfiguration configuration)
    {
        _userManager = userManager;
        _emailService = emailService;
        _mapper = mapper;
        _context = context;
        _configuration = configuration;
    }

    public async Task<ApiResponse<DoctorDto>> CreateDoctorAsync(Doctor doctor, string password)
    {
        if (await _context.Users.AnyAsync(au => au.DocumentNumber == doctor.DocumentNumber))
        {
            return ApiResponse<DoctorDto>.Error(HttpStatusCode.BadRequest,
                "Já existe um utilizador registado com o número de cartão de cidadão enviado.");
        }

        _context.AttachRange(doctor.Institutions);
        var result = await _userManager.CreateAsync(doctor, password);

        if (!result.Succeeded)
        {
            return ApiResponse<DoctorDto>.BadRequest(HttpStatusCode.BadRequest,
                "Ocorreu um erro ao registar o médico", result.Errors);
        }

        await SendAccountConfirmationAsync(doctor.Email);

        var dto = _mapper.DoctorToDto(doctor);
        return ApiResponse<DoctorDto>.Created(dto);
    }

    public async Task<ApiResponse<StoredFileResponseDto>> ChangeProfilePictureAsync(StoredFileRequestDto request)
    {
        var user = await _context.Users
            .Include(u => u.ProfilePicture)
            .FirstOrDefaultAsync(u => u.Id == request.UserId);

        if (user == null)
            return ApiResponse<StoredFileResponseDto>.BadRequest(HttpStatusCode.BadRequest, "Nenhum utilizador encontrado", null);

        if (user.ProfilePicture != null)
        {
            user.ProfilePicture.Content = request.Content;
            user.ProfilePicture.MimeType = request.MimeType;
        }
        else
        {
            user.ProfilePicture = new()
            {
                Content = request.Content,
                MimeType = request.MimeType
            };
            _context.Entry(user.ProfilePicture).State = EntityState.Added;
        }

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return ApiResponse<StoredFileResponseDto>.Success(new StoredFileResponseDto()
        {
            Content = user.ProfilePicture.Content,
            MimeType = user.ProfilePicture.MimeType
        });
    }

    public async Task<ApiResponse<List<PatientDto>>> GetPatientsAsync(CancellationToken token)
    {
        var patients = await _context.Patients.Include(p => p.Address).Where(p => p.Role == Role.Patient).Select(p => _mapper.PatientToDto(p)).ToListAsync(token);
        return ApiResponse<List<PatientDto>>.Success(patients);
    }

    public async Task<ApiResponse<PatientDto>> GetPatientAsync(Guid userId)
    {
        var user = await _context.Patients
            .Include(d => d.Address)
            .Include(d => d.ProfilePicture)
            .FirstOrDefaultAsync(d => d.Id == userId);

        if (user is null)
        {
            return ApiResponse<PatientDto>.Success();
        }

        var dto = _mapper.PatientToDto(user);
        return ApiResponse<PatientDto>.Success(dto);
    }   

    public async Task<ApiResponse<DoctorDto>> GetDoctorAsync(Guid userId)
    {
        var user = await _context.Doctors
          .Include(d => d.Address)
          .Include(d => d.ProfilePicture)
          .Include(d => d.Institutions)
          .FirstOrDefaultAsync(d => d.Id == userId);

        if (user is null)
        {
            return ApiResponse<DoctorDto>.Success();
        }

        var dto = _mapper.DoctorToDto(user);
        return ApiResponse<DoctorDto>.Success(dto);
    }

    public async Task<ApiResponse<PatientDto>> UpdatePatientAsync(PatientDto model)
    {
        var user = await _context.Patients
            .Include(d => d.Address)
            .FirstOrDefaultAsync(c => c.DocumentNumber == model.DocumentNumber);

        if (user is null)
        {
            return ApiResponse<PatientDto>.NotFound("Utilizador não encontrado");
        }

        _mapper.UpdatePatientFromDto(model, user);

        _context.Patients.Update(user);
        await _context.SaveChangesAsync();

        var updatedPatient = _mapper.PatientToDto(user);
        return ApiResponse<PatientDto>.Success(updatedPatient, "Dados do paciente atualizados com sucesso");
    }

    public async Task<ApiResponse<DoctorDto>> UpdateDoctorAsync(DoctorDto model)
    {
        var user = await _context.Doctors
            .Include(d => d.Address)
            .Include(d => d.Institutions) 
            .FirstOrDefaultAsync(c => c.DocumentNumber == model.DocumentNumber);

        if (user is null)
        {
            return ApiResponse<DoctorDto>.NotFound("Utilizador não encontrado");
        }

        _mapper.UpdateDoctorFromDto(model, user);

        var newInstitutionIds = model.Institutions.Select(i => i.Id).ToList();

        var newInstitutions = await _context.Institutions
            .Where(i => newInstitutionIds.Contains(i.Id))
            .ToListAsync();

        user.Institutions.Clear();

        foreach (var institution in newInstitutions)
        {
            user.Institutions.Add(institution);
        }

        _context.Doctors.Update(user);
        await _context.SaveChangesAsync();

        var updatedDoctor = _mapper.DoctorToDto(user);
        return ApiResponse<DoctorDto>.Success(updatedDoctor, "Dados do médico atualizados com sucesso");
    }

    public async Task<ApiResponse<PatientDto>> CreatePatientAsync(Patient patient, string password)
    {
        if (await _context.Users.AnyAsync(au => au.DocumentNumber == patient.DocumentNumber))
        {
            return ApiResponse<PatientDto>.Error(HttpStatusCode.BadRequest,
                "Já existe um utilizador registado com o número de cartão de cidadão enviado.");
        }

        var result = await _userManager.CreateAsync(patient, password);

        if (!result.Succeeded)
        {
            return ApiResponse<PatientDto>.BadRequest(HttpStatusCode.BadRequest,
                "Ocorreu um erro ao registar o utente", result.Errors);
        }

        await SendAccountConfirmationAsync(patient.Email);

        var dto = _mapper.PatientToDto(patient);
        return ApiResponse<PatientDto>.Success(dto);
    }

    public async Task<ApiResponse<DashboardDto>> GetDashboardAsync(Guid userId, CancellationToken token)
    {
        var user = await _context.Users
            .Include(u => u.Notifications)
            .FirstOrDefaultAsync(u => u.Id == userId, token);

        if (user == null)
        {
            return ApiResponse<DashboardDto>.NotFound();
        }

        user.Notifications = user.Notifications
            .OrderByDescending(n => n.NotificationDate)
            .Take(3)
            .ToList();

        var medicalAppointments = await _context.MedicalAppointments
            .Include(c => c.Appointment)
            .ThenInclude(a => a.Institution)
            .Include(c => c.MedicalLeave)
            .Where(c => user.Role == Role.Patient
                ? c.Appointment.PatientId == userId
                : c.Appointment.DoctorId == userId) 
            .ToListAsync(token);

        medicalAppointments = medicalAppointments.OrderByDescending(c => c.Created).Take(10).ToList();

        var appointments = _mapper.MedicalAppointmentsToMedicalAppointmentsResponseDto(medicalAppointments);

        var dashboard = new DashboardDto
        {
            User = _mapper.UserToDto(user),
            Appointments = appointments
        };

        return ApiResponse<DashboardDto>.Success(dashboard);
    }

    public async Task<ApplicationUser?> FindByDocumentNumberAsync(string docNumber)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.DocumentNumber == docNumber);

        return user;
    }

    public bool ValidateCredentials(ApplicationUser user, string password)
    {
        var t = _userManager.PasswordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            password);

        return t == PasswordVerificationResult.Success;
    }

    public async Task<ApiResponse<ApplicationUser>> GetById(Guid id)
    {

        var user = await _context.Users.Include(u => u.ProfilePicture).FirstOrDefaultAsync(user => user.Id == id);

        return ApiResponse<ApplicationUser>.Success(data: user);
    }

    public async Task<ApiResponse<bool>> ForgotPassword(ForgotPasswordRequestDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);


        if(user is null || !IsUserCredentialsValid(model,user))
        {
            return ApiResponse<bool>.BadRequest(HttpStatusCode.BadRequest,"Falha ao recuperar Password", null);
        }

        string randomPassword = GeneratePassword();
        string token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, randomPassword);

        if (result.Succeeded)
        {
            _emailService.SendPasswordResetEmail(model.Email, randomPassword);
        }

        return ApiResponse<bool>.Success();
    }

    public async Task<ApiResponse<bool>> SendAccountConfirmationAsync(string email)
    {
        var user = _userManager.Users.FirstOrDefault(u => u.Email == email);

        if (user is not null)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationUrl = $"{_configuration["WebApp"]}/account/confirm?email={user.Email}&token={token}";

            _emailService.SendAccountConfirmationEmail(user.Email!, confirmationUrl);
        }

        return ApiResponse<bool>.Success();
    }

    public async Task<ApiResponse<bool>> ConfirmAccount(string token, string email)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is not null)
        {
            var confirmation = await _userManager.ConfirmEmailAsync(user, token);

            if (confirmation.Succeeded)
            {
                return ApiResponse<bool>.Success(message: "Conta confirmada com sucesso");
            }
        }

        return ApiResponse<bool>.Error(HttpStatusCode.BadRequest,
            "Não foi possível confirmar a conta, tente novamente mais tarde.");
    }

    private string GeneratePassword(
        int requiredLength = 12,
        int requiredUniqueChars = 1,
        bool requireNonAlphanumeric = true,
        bool requireLowercase = true,
        bool requireUppercase = true,
        bool requireDigit = true)
    {
        const string lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const string uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string digitChars = "0123456789";
        const string nonAlphanumericChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

        var random = new Random();
        var passwordChars = "";

        if (requireLowercase)
            passwordChars += lowercaseChars[random.Next(lowercaseChars.Length)];
        if (requireUppercase)
            passwordChars += uppercaseChars[random.Next(uppercaseChars.Length)];
        if (requireDigit)
            passwordChars += digitChars[random.Next(digitChars.Length)];
        if (requireNonAlphanumeric)
            passwordChars += nonAlphanumericChars[random.Next(nonAlphanumericChars.Length)];

        var allChars = (lowercaseChars + uppercaseChars + digitChars + nonAlphanumericChars).ToCharArray();
        while (passwordChars.Length < requiredLength)
        {
            passwordChars += allChars[random.Next(allChars.Length)];
        }

        passwordChars = new string(passwordChars.OrderBy(_ => random.Next()).ToArray());
        if (requiredUniqueChars > 1)
        {
            var uniqueCount = passwordChars.Distinct().Count();
            while (uniqueCount < requiredUniqueChars)
            {
                passwordChars += allChars[random.Next(allChars.Length)];
                uniqueCount = passwordChars.Distinct().Count();
            }
        }

        return new string(passwordChars.OrderBy(_ => random.Next()).ToArray());
    }

    private bool IsUserCredentialsValid(ForgotPasswordRequestDto model, ApplicationUser user)
    {
        return model.BirthDate.Year == user.BirthDate.Year &&
               model.BirthDate.Month == user.BirthDate.Month &&
               model.BirthDate.Day == user.BirthDate.Day &&
               model.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase) &&
               model.DocumentNumber == user.DocumentNumber;
    }
}