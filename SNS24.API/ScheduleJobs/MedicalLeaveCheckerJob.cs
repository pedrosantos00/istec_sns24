using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Quartz;
using SNS24.API.Enums;
using SNS24.API.Services.Interfaces;
using SNS24.WebApi.Data;
using SNS24.WebApi.Enums;
using SNS24.WebApi.Models;

public class MedicalLeaveCheckerJob : IJob
{
    private readonly INotificationService _notificationService;
    private readonly ApplicationDbContext _context;

    public MedicalLeaveCheckerJob(INotificationService notificationService, ApplicationDbContext context)
    {
        _notificationService = notificationService;
        _context = context;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        var now = DateTime.UtcNow;

        await NotifyForExpiringLeaves(now, 7, NotificationState.Notified7Days);

        await NotifyForExpiringLeaves(now, 2, NotificationState.Notified2Days);

        await NotifyForExpiringLeaves(now, 1, NotificationState.Notified1Day);

        await NotifyForExpiredLeaves(now);
    }

    private async Task NotifyForExpiringLeaves(DateTime now, int daysBeforeExpiration, NotificationState targetNotificationState)
    {
        var expiringLeaves = await _context.MedicalLeaves
            .Include(m => m.Patient)
            .Where(m => m.EndDate > now
                        && m.EndDate <= now.AddDays(daysBeforeExpiration)
                        && m.NotificationState < targetNotificationState
                        && m.Status == MedicalLeaveStatus.Active)
            .ToListAsync();

        foreach (var leave in expiringLeaves)
        {
            if (leave.Patient != null)
            {
                await _notificationService.NotifyExpiringMedicalLeaveAsync(leave.Patient.Id, leave.EndDate);

                leave.NotificationState = targetNotificationState;
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task NotifyForExpiredLeaves(DateTime now)
    {
        var expiredLeaves = await _context.MedicalLeaves
            .Include(m => m.Patient)
            .Where(m => m.EndDate <= now
                        && m.NotificationState != NotificationState.NotifiedExpired
                        && m.Status == MedicalLeaveStatus.Active)
            .ToListAsync();

        foreach (var leave in expiredLeaves)
        {
            if (leave.Patient != null)
            {
                await _notificationService.NotifyExpiredMedicalLeaveAsync(leave.Patient.Id);

                leave.NotificationState = NotificationState.NotifiedExpired;

                leave.Status = MedicalLeaveStatus.Expired;
            }
        }

        await _context.SaveChangesAsync();
    }
}
