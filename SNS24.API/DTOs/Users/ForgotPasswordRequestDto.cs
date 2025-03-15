namespace SNS24.Api.DTOs.Users;

public class ForgotPasswordRequestDto
{
    public string DocumentNumber { get; set; }
    public string Email { get; set; }
    public DateTime BirthDate { get; set; }
}