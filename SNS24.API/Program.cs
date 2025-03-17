using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Quartz;
using Quartz.Simpl;
using SNS24.Api.Services;
using SNS24.WebApi.Data;
using SNS24.WebApi.Helpers;
using SNS24.WebApi.Models;
using SNS24.WebApi.Utilities;

namespace SNS24.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure DbContext
            builder.Services.AddDbContext<ApplicationDbContext>(opt =>
                opt.UseSqlServer(Environment.GetEnvironmentVariable("CONNECTION_STRING"))
            );

            // Quartz
            builder.Services.AddQuartz(q =>
            {
                // Use the Microsoft Dependency Injection Job Factory
                q.UseJobFactory<MicrosoftDependencyInjectionJobFactory>();

                // Register the MedicalLeaveCheckerJob
                q.AddJob<MedicalLeaveCheckerJob>(opts => opts.WithIdentity("MedicalLeaveCheckerJob"));

                // Schedule the job to run every 15 minutes
                q.AddTrigger(opts => opts
                    .ForJob("MedicalLeaveCheckerJob") // Link to the job
                    .WithIdentity("MedicalLeaveCheckerTrigger")
                    .WithSimpleSchedule(x => x
                        .WithIntervalInMinutes(15)
                        .RepeatForever()));
            });

            // Add Quartz Hosted Service
            builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Cors",
                    builder =>
                    {
                        builder.AllowAnyOrigin();
                        builder.AllowAnyMethod();
                        builder.AllowAnyHeader();
                    });
            });

            builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SMTP"));


            builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Configure Services and Authentication
            builder.Services.ConfigureAuthentication(builder.Configuration);
            builder.Services.ConfigureSwagger();
            builder.Services.ConfigureServices();

            builder.Services.AddControllers();

            builder.Services.Configure<PasswordHasherOptions>(options =>
            {
                options.CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV3;
            });

            var app = builder.Build();

            // Apply migrations at startup
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                dbContext.Database.Migrate();
            }

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                context.Database.EnsureCreated();

                InstitutionSeeder.Seed(context);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<CustomExceptionHandlerMiddleware>();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors("Cors");
            app.UseHttpsRedirection();

            app.MapControllers();

            app.Run();
        }
    }
}