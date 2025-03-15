using Microsoft.EntityFrameworkCore;
using SNS24.Api.DTOs.MedicalAppointments;
using SNS24.Api.Mappers;
using SNS24.Api.Models.MedicalAppointment;
using SNS24.Api.Services.Interfaces;
using SNS24.API.Services.Interfaces;
using SNS24.API.Utilities;
using SNS24.WebApi.Data;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models;
using System.Net;

namespace SNS24.Api.Services;

public class MedicalAppointmentService : IMedicalAppointmentService
{
    private readonly ApplicationDbContext _context;
    private readonly ObjectMapper _mapper;
    private readonly INotificationService _notificationService;

    public MedicalAppointmentService(ApplicationDbContext context, ObjectMapper mapper, INotificationService notificationService)
    {
        _context = context;
        _mapper = mapper;
        _notificationService = notificationService;
    }

    public async Task<ApiResponse<MedicalAppointmentResponseDto>> Create(MedicalAppointment medicalAppointment, Guid userId, CancellationToken token)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, token);
        if (user is null)
        {
            return ApiResponse<MedicalAppointmentResponseDto>.NotFound();
        }

        if (user.Role == Role.Doctor)
        {
            medicalAppointment.Appointment.DoctorId = userId;
            medicalAppointment.Appointment.Attended = true;
            await _notificationService.NotifyAppointmentCreatedAsync(medicalAppointment.Appointment.PatientId, medicalAppointment.Appointment.Date, "");
        }
        else
        {
            medicalAppointment.Appointment.PatientId = userId;
            await _notificationService.NotifyAppointmentCreatedAsync(medicalAppointment.Appointment.PatientId, medicalAppointment.Appointment.Date, "");
        }

        if(medicalAppointment.MedicalLeave is not null)
        {
            medicalAppointment.MedicalLeave.DoctorId = userId;
            medicalAppointment.MedicalLeave.PatientId = medicalAppointment.Appointment.PatientId;
            await _notificationService.NotifyMedicalLeaveCreatedAsync(medicalAppointment.Appointment.PatientId, medicalAppointment.MedicalLeave.StartDate, medicalAppointment.MedicalLeave.EndDate);
            medicalAppointment.MedicalLeave.Status = medicalAppointment.MedicalLeave.EndDate < DateTime.UtcNow ? MedicalLeaveStatus.Expired : MedicalLeaveStatus.Active;
        }

        _context.MedicalAppointments.Add(medicalAppointment);
        if (await _context.SaveChangesAsync(token) <= 0)
        {
            return ApiResponse<MedicalAppointmentResponseDto>.Error(
                HttpStatusCode.BadRequest,
                "Ocorreu um erro ao criar a consulta médica. Tente novamente mais tarde.");
        }

        

        var dto = _mapper.MedicalAppointmentToMedicalAppointmentResponseDto(medicalAppointment);

        return ApiResponse<MedicalAppointmentResponseDto>.Success(dto);
    }


    public async Task<ApiResponse<MedicalAppointmentResponseDto>> Update(MedicalAppointment medicalAppointment, Guid userId, CancellationToken token)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, token);
        if (user is null)
        {
            return ApiResponse<MedicalAppointmentResponseDto>.NotFound();
        }

        if (user.Role == Role.Doctor)
        {
            medicalAppointment.Appointment.DoctorId = userId;
            medicalAppointment.Appointment.Attended = true;
            await _notificationService.NotifyAppointmentCreatedAsync(userId, medicalAppointment.Appointment.Date, "");
        }
        else
        {
            medicalAppointment.Appointment.PatientId = userId;
            await _notificationService.NotifyAppointmentCreatedAsync(userId, medicalAppointment.Appointment.Date, "");
        }

        if (medicalAppointment.MedicalLeave is not null)
        {
            medicalAppointment.MedicalLeave.DoctorId = userId;
            medicalAppointment.MedicalLeave.PatientId = medicalAppointment.Appointment.PatientId;
            await _notificationService.NotifyMedicalLeaveCreatedAsync(medicalAppointment.Appointment.PatientId, medicalAppointment.MedicalLeave.StartDate, medicalAppointment.MedicalLeave.EndDate);
            medicalAppointment.MedicalLeave.Status = medicalAppointment.MedicalLeave.EndDate < DateTime.UtcNow ? MedicalLeaveStatus.Expired : MedicalLeaveStatus.Active;
        }


        _context.Attach(medicalAppointment);
        _context.MedicalAppointments.Update(medicalAppointment);

        if (await _context.SaveChangesAsync(token) <= 0)
        {
            return ApiResponse<MedicalAppointmentResponseDto>.Error(HttpStatusCode.BadRequest,
                "Ocorreu um erro ao atualizar a consulta médica. Tente novamente mais tarde");
        }

        var dto = _mapper.MedicalAppointmentToMedicalAppointmentResponseDto(medicalAppointment);

        return ApiResponse<MedicalAppointmentResponseDto>.Success(dto);
    }

    public async Task<ApiResponse<IEnumerable<MedicalAppointmentResponseDto>>> GetAll(string role, Guid userId, CancellationToken token)
    {
        // Base query for medical appointments
        IQueryable<MedicalAppointment> query = _context.MedicalAppointments
            .Include(m => m.Appointment)
            .ThenInclude(a => a.Institution) // Include Institution for filtering
            .AsNoTracking();

        if (role == "Patient")
        {
            // Patients can only see their own appointments
            query = query.Where(ma => ma.Appointment.PatientId == userId);
        }
        else if (role == "Doctor")
        {
            // Get institutions where the doctor is associated
            var doctorInstitutionsIds = await _context.Institutions
                .Where(i => i.Doctors.Any(d => d.Id == userId))
                .Select(i => i.Id)
                .ToListAsync(cancellationToken: token);

            // Check if the doctor belongs to any public institution
            bool isInPublicSector = await _context.Institutions
                .AnyAsync(i => i.IsPublicSector && i.Doctors.Any(d => d.Id == userId), cancellationToken: token);

            if (isInPublicSector)
            {
                // If the doctor is in the public sector, return:
                // - Appointments from public institutions
                // - The doctor's own appointments
                query = query.Where(ma =>
                    (ma.Appointment.Institution != null) ||
                    ma.Appointment.DoctorId == userId);
            }
            else
            {
                // If the doctor is only in the private sector, return:
                // - The doctor's own appointments
                // - Pending appointments from institutions the doctor is associated with
                query = query.Where(ma =>
                    ma.Appointment.DoctorId == userId || // Appointments directly assigned to the doctor
                    (ma.Appointment.InstitutionId != null &&
                     doctorInstitutionsIds.Contains(ma.Appointment.InstitutionId) && // Only institutions the doctor belongs to
                     !ma.Appointment.Attended)); // Only pending appointments
            }
        }

        // Execute the query
        var medicalAppointments = await query.ToListAsync(cancellationToken: token);

        // Check if no appointments were found
        if (medicalAppointments.Count <= 0)
        {
            return ApiResponse<IEnumerable<MedicalAppointmentResponseDto>>.Success();
        }

        // Map entities to DTOs
        var dtos = _mapper.MedicalAppointmentsToMedicalAppointmentsResponseDto(medicalAppointments);

        return ApiResponse<IEnumerable<MedicalAppointmentResponseDto>>.Success(dtos);
    }



    public async Task<ApiResponse<MedicalAppointmentResponseDto>> GetById(CancellationToken token, Guid id)
    {
        var medicalAppointment =
            await _context.MedicalAppointments
                .Include(m => m.Appointment)
                .ThenInclude(a => a.Institution)
                .Include(m => m.MedicalLeave)
                .ThenInclude(m => m.Doctor)
                .Include(m => m.MedicalLeave)
                .ThenInclude(m => m.Patient)
                .FirstOrDefaultAsync(ma => ma.Id == id, cancellationToken: token);

        if (medicalAppointment is null)
        {
            return ApiResponse<MedicalAppointmentResponseDto>.Error(HttpStatusCode.NotFound,
                "Não foi encontrada nenhuma consulta");
        }

        var dto = _mapper.MedicalAppointmentToMedicalAppointmentResponseDto(medicalAppointment);

        return ApiResponse<MedicalAppointmentResponseDto>.Success(dto);
    }

    public async Task<ApiResponse<bool>> Delete(CancellationToken token, Guid id)
    {
        var medicalAppointment = await _context.MedicalAppointments.FirstOrDefaultAsync(ma => ma.Id == id);

        if (medicalAppointment is null)
        {
            return ApiResponse<bool>.Error(HttpStatusCode.BadRequest,
                "Não foi possível encontrar a consulta que pretende eliminar.");
        }

        _context.MedicalAppointments.Remove(medicalAppointment);

        if (await _context.SaveChangesAsync(token) <= 0)
        {
            return ApiResponse<bool>.Error(HttpStatusCode.BadRequest,
                "Ocorreu um erro ao eliminar a consulta médica. Tente novamente mais tarde");
        }

        return ApiResponse<bool>.Success(true);
    }
}