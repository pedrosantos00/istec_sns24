using Microsoft.EntityFrameworkCore;
using SNS24.Api.DTOs.MedicalAppointments;
using SNS24.Api.DTOs.MedicalLeavers;
using SNS24.Api.Mappers;
using SNS24.Api.Models.MedicalAppointment;
using SNS24.API.Services.Interfaces;
using SNS24.API.Utilities;
using SNS24.WebApi.Data;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models;
using System.Collections.Generic;

namespace SNS24.API.Services
{
    public class MedicalLeavesService : IMedicalLeavesService
    {
        public readonly ApplicationDbContext _context;
        public readonly ObjectMapper _mapper;

        public MedicalLeavesService(ApplicationDbContext context, ObjectMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<MedicalLeaveResponseDto>>> GetAll(Guid userId, string role, CancellationToken token)
        {
            IQueryable<MedicalLeave> query = _context.MedicalLeaves
                .Include(c => c.Doctor)
                .Include(c => c.Patient);

            if (role == "Patient")
            {
                query = query.Where(ma => ma.PatientId == userId);
            }
            else if (role == "Doctor")
            {
                query = query.Where(ma => ma.DoctorId == userId);
            }
                
            var leaves = await query
                .Select(c => _mapper.MedicalLeaveToDto(c))
                .ToListAsync(cancellationToken: token);

            if (leaves.Count <= 0)
            {
                return ApiResponse<List<MedicalLeaveResponseDto>>.Success();
            }

            return ApiResponse<List<MedicalLeaveResponseDto>>.Success(leaves);
        }

        public async Task<ApiResponse<MedicalLeaveResponseDto>> GetById(Guid leaveId, CancellationToken token)
        {
            var leave = await _context.MedicalLeaves
               .Include(c => c.Doctor)
                .Include(c => c.Patient)
               .Select(c => _mapper.MedicalLeaveToDto(c))
               .FirstOrDefaultAsync(l => l.Id == leaveId);

            return ApiResponse<MedicalLeaveResponseDto>.Success(leave);
        }
    }
}
