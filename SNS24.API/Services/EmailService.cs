using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace SNS24.Api.Services;

public class SmtpSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}

public class EmailService
{
    private readonly string _username = Environment.GetEnvironmentVariable("SMTP_USERNAME");
    private readonly string _password = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
    public EmailService()
    {
    }

    public void SendEmailWithTemplate(string toEmail, string subject, string templateName, Dictionary<string, string> placeholders)
    {
        var templatePath = Path.Combine("Templates", templateName);
        var emailTemplate = File.ReadAllText(templatePath);

        if (placeholders != null)
        {
            foreach (var placeholder in placeholders)
            {
                emailTemplate = emailTemplate.Replace(placeholder.Key, placeholder.Value);
            }
        }

        SendEmail(toEmail, subject, emailTemplate);
    }

    public void SendGeneralEmail(string paraEmail, string titulo, string descricao, string portalLink)
    {
        var emailTemplate = File.ReadAllText("Templates/NotificacaoEmailTemplate.html");
        emailTemplate = emailTemplate.Replace("{{TITULO}}", titulo)
                                     .Replace("{{DESCRICAO}}", descricao)
                                     .Replace("{{PORTAL_LINK}}", portalLink);

        SendEmail(paraEmail, "Notificação SNS24", emailTemplate);
    }

    public void SendPasswordResetEmail(string toEmail, string tempPassword)
    {
        var emailTemplate = File.ReadAllText("Templates/PasswordRecoveryTemplate.html");
        emailTemplate = emailTemplate.Replace("{{TEMP_PASSWORD}}", tempPassword);

        SendEmail(toEmail, "Recuperar Palavra-Passe", emailTemplate);
    }

    public void SendAccountConfirmationEmail(string toEmail, string confirmationUrl)
    {
        var emailTemplate = File.ReadAllText("Templates/AccountConfirmationTemplate.html");
        emailTemplate = emailTemplate.Replace("{{CONFIRMATION_LINK}}", confirmationUrl);

        SendEmail(toEmail, "Confirmar Conta", emailTemplate);
    }

    public void SendMedicalLeaveExpiringEmail(string toEmail, DateTime expirationDate, string portalLink)
    {
        var emailTemplate = File.ReadAllText("Templates/MedicalLeaveExpiringTemplate.html");
        emailTemplate = emailTemplate.Replace("{{EXPIRATION_DATE}}", expirationDate.ToString("dd/MM/yyyy"))
                                     .Replace("{{PORTAL_LINK}}", portalLink);

        SendEmail(toEmail, "Baixa Médica a Expirar", emailTemplate);
    }

    public void SendMedicalLeaveExpiredEmail(string toEmail, string portalLink)
    {
        var emailTemplate = File.ReadAllText("Templates/MedicalLeaveExpiredTemplate.html");
        emailTemplate = emailTemplate.Replace("{{PORTAL_LINK}}", portalLink);

        SendEmail(toEmail, "Baixa Médica Expirada", emailTemplate);
    }

    public void SendSystemAnnouncementEmail(string toEmail, string announcementDetails, string portalLink)
    {
        var emailTemplate = File.ReadAllText("Templates/SystemAnnouncementTemplate.html");
        emailTemplate = emailTemplate.Replace("{{ANNOUNCEMENT_DETAILS}}", announcementDetails)
                                     .Replace("{{PORTAL_LINK}}", portalLink);

        SendEmail(toEmail, "Atualização do Sistema", emailTemplate);
    }

    private void SendEmail(string toEmail, string subject, string body)
    {
        var mailMessage = new MailMessage
        {
            From = new MailAddress(_username, "SNS24"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(toEmail);

        using var smtpClient = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential(_username, _password),
            EnableSsl = true
        };

        smtpClient.Send(mailMessage);
    }
}
