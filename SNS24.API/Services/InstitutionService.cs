using System.Net;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using SNS24.Api.DTOs.Institutions;
using SNS24.Api.Mappers;
using SNS24.Api.Services.Interfaces;
using SNS24.API.Utilities;
using SNS24.WebApi.Data;
using SNS24.WebApi.Models;

namespace SNS24.Api.Services;

public class InstitutionService : IInstitutionService
{
    private readonly ApplicationDbContext _context;
    private readonly ObjectMapper _mapper;

    public InstitutionService(ApplicationDbContext context, ObjectMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<IEnumerable<InstitutionResponseDto>>> GetAllAsync()
    {
        var institutions = await _context.Institutions
            .Include(i => i.Address)
            .Include(i => i.Doctors)
            .ThenInclude(d => d.Address)
            .Select(i => _mapper.InstitutionToInstitutionResponseDto(i))
            .ToListAsync();


        if (institutions.Count == 0)
        {
            return ApiResponse<IEnumerable<InstitutionResponseDto>>.NotFound(
                "Não foi possível encontrar institutos");
        }

        return ApiResponse<IEnumerable<InstitutionResponseDto>>.Success(institutions);
    }

    public async Task<ApiResponse<IEnumerable<InstitutionResponseDto>>> GetFilteredAsync(Guid userId, string userRole)
    {
        var institutionsQuery = _context.Institutions
            .Include(i => i.Address)
            .Include(i => i.Doctors)
            .ThenInclude(d => d.Address)
            .AsQueryable();

        if (userRole == "Doctor")
        {
            institutionsQuery = institutionsQuery
                .Where(i => i.Doctors.Any(d => d.Id == userId)); 
        }

        var institutions = await institutionsQuery.ToListAsync();

        if (!institutions.Any())
        {
            return ApiResponse<IEnumerable<InstitutionResponseDto>>.NotFound(
                "Não foi possível encontrar institutos");
        }

        var dto = institutions.Select(i => _mapper.InstitutionToInstitutionResponseDto(i));

        return ApiResponse<IEnumerable<InstitutionResponseDto>>.Success(dto);
    }


    public async Task<ApiResponse<InstitutionResponseDto>> GetByIdAsync(Guid id)
    {
        var institution = await _context.Institutions
            .Include(i => i.Address)
            .Include(i => i.Doctors)
            .ThenInclude(d => d.Address)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (institution is null)
        {
            return ApiResponse<InstitutionResponseDto>.NotFound(
                "Não foi possível encontrar o instituto");
        }

        var dto = _mapper.InstitutionToInstitutionResponseDto(institution);

        return ApiResponse<InstitutionResponseDto>.Success(dto);
    }
}