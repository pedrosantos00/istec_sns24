using Microsoft.EntityFrameworkCore;
using SNS24.Api.Services;
using SNS24.API.Models.Common;
using SNS24.API.Services.Interfaces;
using SNS24.WebApi.Data;
using SNS24.WebApi.Models;

namespace SNS24.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly string _portalLink;

        public NotificationService(ApplicationDbContext context, EmailService emailService, IConfiguration configuration)
        {
            _portalLink = configuration["WebApp"];
            _context = context;
            _emailService = emailService;
        }

        private async Task SendNotificationAsync(Guid userId, string title, string message, string templateName, Dictionary<string, string> placeholders = null)
        {
            var notification = new Notification
            {
                Title = title,
                Message = message,
                NotificationDate = DateTime.UtcNow,
                UserId = userId,
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FirstOrDefaultAsync(c => c.Id == userId);
            if (user != null)
            {
                _emailService.SendEmailWithTemplate(user.Email, title, templateName, placeholders);
            }
        }

        public async Task NotifyAppointmentCreatedAsync(Guid userId, DateTime appointmentDate, string location)
        {
            string title = "Nova Consulta Agendada";
            string message = $"A sua consulta foi agendada para {appointmentDate:dd/MM/yyyy às HH:mm} no local: {location}";
            var placeholders = new Dictionary<string, string>
            {
                { "{{APPOINTMENT_DATE}}", appointmentDate.ToString("dd/MM/yyyy HH:mm") },
                { "{{LOCATION}}", location },
                { "{{PORTAL_LINK}}", _portalLink }
            };
            await SendNotificationAsync(userId, title, message, "AppointmentCreatedTemplate.html", placeholders);
        }

        public async Task NotifyMedicalLeaveCreatedAsync(Guid userId, DateTime startDate, DateTime endDate)
        {
            string title = "Nova Baixa Médica Criada";
            string message = $"A sua baixa médica foi criada e é válida de {startDate:dd/MM/yyyy} até {endDate:dd/MM/yyyy}";
            var placeholders = new Dictionary<string, string>
            {
                { "{{START_DATE}}", startDate.ToString("dd/MM/yyyy") },
                { "{{END_DATE}}", endDate.ToString("dd/MM/yyyy") },
                { "{{PORTAL_LINK}}", _portalLink }
            };
            await SendNotificationAsync(userId, title, message, "MedicalLeaveCreatedTemplate.html", placeholders);
        }

        public async Task NotifyExpiringMedicalLeaveAsync(Guid userId, DateTime expirationDate)
        {
            string title = "Baixa Médica a Expirar";
            string message = $"A sua baixa médica está prestes a expirar no dia {expirationDate:dd/MM/yyyy}.";
            var placeholders = new Dictionary<string, string>
            {
                { "{{EXPIRATION_DATE}}", expirationDate.ToString("dd/MM/yyyy") },
                { "{{PORTAL_LINK}}", _portalLink }
            };
            await SendNotificationAsync(userId, title, message, "MedicalLeaveExpiringTemplate.html", placeholders);
        }

        public async Task NotifyExpiredMedicalLeaveAsync(Guid userId)
        {
            string title = "Baixa Médica Expirada";
            string message = "A sua baixa médica expirou. Se necessário, contacte o seu médico para prolongar ou criar uma nova baixa.";
            var placeholders = new Dictionary<string, string>
            {
                { "{{PORTAL_LINK}}", _portalLink }
            };
            await SendNotificationAsync(userId, title, message, "MedicalLeaveExpiredTemplate.html", placeholders);
        }

        public async Task NotifyAccountCreatedAsync(Guid userId)
        {
            string title = "Conta Criada com Sucesso";
            string message = "Bem-vindo ao SNS24! A sua conta foi criada com sucesso. Aceda ao portal para explorar os serviços disponíveis.";
            var placeholders = new Dictionary<string, string>
            {
                { "{{PORTAL_LINK}}", _portalLink }
            };
            await SendNotificationAsync(userId, title, message, "AccountCreatedTemplate.html", placeholders);
        }

        public async Task NotifySystemAnnouncementAsync(Guid userId, string announcementDetails)
        {
            string title = "Atualização do Sistema";
            string message = $"Novo anúncio do sistema: {announcementDetails}";
            var placeholders = new Dictionary<string, string>
            {
                { "{{ANNOUNCEMENT_DETAILS}}", announcementDetails },
                { "{{PORTAL_LINK}}", _portalLink }
            };
            await SendNotificationAsync(userId, title, message, "SystemAnnouncementTemplate.html", placeholders);
        }
    }
}
