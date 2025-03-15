using Riok.Mapperly.Abstractions;
using SNS24.Api.DTOs.Appointments;
using SNS24.Api.DTOs.Doctors;
using SNS24.Api.DTOs.Institutions;
using SNS24.Api.DTOs.MedicalAppointments;
using SNS24.Api.DTOs.MedicalLeavers;
using SNS24.Api.DTOs.Patients;
using SNS24.Api.DTOs.StoredFiles;
using SNS24.Api.DTOs.Users;
using SNS24.Api.Models.Appointments;
using SNS24.Api.Models.Files;
using SNS24.Api.Models.MedicalAppointment;
using SNS24.API.DTOs.Address;
using SNS24.API.DTOs.Common;
using SNS24.API.DTOs.Users;
using SNS24.API.Models.Common;
using SNS24.WebApi.Models;
using SNS24.WebApi.Models.Common;

namespace SNS24.Api.Mappers;

[Mapper(AllowNullPropertyAssignment = true, ThrowOnPropertyMappingNullMismatch = false)]
public partial class ObjectMapper
{
    public ApplicationUser UserRegisterDtoToApplicationUser(UserRegisterDto request)
    {
        var appUser = new ApplicationUser()
        {
            UserName = request.Email,
            Email = request.Email,
            BirthDate = request.BirthDate,
            DocumentNumber = request.DocumentNumber,
            NormalizedEmail = request.Email.ToLower(),
            NormalizedUserName = request.Email.ToLower(),
            EmailConfirmed = false,
            Gender = request.Gender,
            Name = request.Name,
            Address = new Address
            {
                Street = request.Address.Street,
                City = request.Address.City,
                State = request.Address.State,
                PostalCode = request.Address.PostalCode,
                Country = request.Address.Country
            }
        };

        return appUser;
    }

    public partial MedicalAppointment
        MedicalAppointmentRequestDtoToMedicalAppointment(MedicalAppointmentRequestDto dto);

    public partial MedicalAppointmentResponseDto MedicalAppointmentToMedicalAppointmentResponseDto(
        MedicalAppointment medicalAppointment);

    public partial IEnumerable<MedicalAppointmentResponseDto> MedicalAppointmentsToMedicalAppointmentsResponseDto(
        IEnumerable<MedicalAppointment> appointments);

    public partial Appointment AppointmentRequestDtoToAppointment(AppointmentRequestDto request);
    public partial AppointmentResponseDto AppointmentToAppointmentResponseDto(Appointment appointment);

    [MapProperty(nameof(UserRegisterDto.Username), nameof(Doctor.UserName))]
    public partial Doctor UserRegisterDtoToDoctor(UserRegisterDto request);

    [MapProperty(nameof(UserRegisterDto.Username), nameof(Patient.UserName))]
    public partial Patient UserRegisterDtoToPatient(UserRegisterDto request);

    public partial List<InstitutionResponseDto> InstitutionsToInstitutionsResponseDto(
        List<Institution> institutions);

    public partial InstitutionResponseDto InstitutionToInstitutionResponseDto(
        Institution institutions);

    public partial ApplicationUserDto UserToDto(ApplicationUser request);

    public partial DoctorDto DoctorToDto(Doctor request);
    public partial PatientDto PatientToDto(Patient request);

    public partial Doctor DtoToDoctor(DoctorDto request);
    public partial Patient DtoToPatient(PatientDto request);

    [MapperIgnoreSource(nameof(PatientDto.ProfilePicture))]
    public partial void UpdatePatientFromDto(PatientDto request, Patient patient);

    [MapperIgnoreSource(nameof(PatientDto.ProfilePicture))]
    public partial void UpdateDoctorFromDto(DoctorDto request, Doctor doctor);


    public partial StoredFileResponseDto StoredFileToStoredFileResponseDto(StoredFile file);
    public partial StoredFile StoredFileRequestDtoToStoredFile(StoredFileRequestDto file);

    public partial AddressResponseDto AdressToDto(Address source);
    public partial Address AddressDtoToDomain(AddressResponseDto source);

    public partial MedicalLeaveResponseDto MedicalLeaveToDto(MedicalLeave source);

    public partial NotificationDto NotificationToDto(Notification source);



}