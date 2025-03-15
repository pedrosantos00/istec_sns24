namespace SNS24.Api.DTOs.StoredFiles;

public class StoredFileRequestDto
{
    public Guid? UserId { get; set; }
    public byte[] Content { get; set; }
    public string MimeType { get; set; }
}