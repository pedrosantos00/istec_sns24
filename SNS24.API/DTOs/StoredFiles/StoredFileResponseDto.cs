namespace SNS24.Api.DTOs.StoredFiles;

public class StoredFileResponseDto
{
    public Guid? Id { get; set; }
    public byte[]? Content { get; set; }
    public string? MimeType { get; set; }
}