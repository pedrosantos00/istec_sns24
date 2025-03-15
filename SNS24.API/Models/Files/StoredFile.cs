using SNS24.WebApi.Models;

namespace SNS24.Api.Models.Files;

public class StoredFile : BaseEntity
{
    public byte[] Content { get; set; }
    public string MimeType { get; set; }
}