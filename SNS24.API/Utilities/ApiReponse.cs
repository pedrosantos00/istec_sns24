using System.Diagnostics;
using System.Net;
using System.Reflection;
using System.Text.Json;
using SNS24.Api.DTOs.MedicalAppointments;

namespace SNS24.API.Utilities;

public record ApiResponse<T>(HttpStatusCode Code, T? Data, string? Message, object? Errors)
{
    public static ApiResponse<T> BadRequest(HttpStatusCode code, string message, object? errors)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = false,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };
        return new ApiResponse<T>(code, default, message, errors ?? JsonSerializer.Serialize(errors, options));
    }

    public static ApiResponse<T> Error(HttpStatusCode code, string message) => new(code, default, message, null);

    public static ApiResponse<T> NotFound(string? message = "Não Encontrado") => new(HttpStatusCode.NotFound, default, message, null);

    public static ApiResponse<T> Success(T? data = default, string? message = default) => new(HttpStatusCode.OK, data, message, default);

    public static ApiResponse<T> Created(T? data = default, string? message = default) => new(HttpStatusCode.Created, data, message, null);
}