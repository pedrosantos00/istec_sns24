using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SNS24.Api.Services.Interfaces;
using SNS24.Api.Services;
using SNS24.WebApi.Helpers;
using SNS24.WebApi.Utilities.Authorization;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using SNS24.Api.Mappers;
using SNS24.WebApi.Enums;
using SNS24.API.Services.Interfaces;
using SNS24.API.Services;

namespace SNS24.WebApi.Utilities
{
    public static class ServicesConfiguration
    {
        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthorizationHandler, RoleRequirementHandler>();
            services.AddScoped<ObjectMapper>();
            services.AddScoped<IApplicationUserService, ApplicationUserService>();
            services.AddScoped<IInstitutionService, InstitutionService>();
            services.AddScoped<IMedicalLeavesService, MedicalLeavesService>();
            services.AddScoped<IMedicalAppointmentService, MedicalAppointmentService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IStoredFileService, StoredFileService>();
            services.AddScoped<EmailService>();
            services.AddScoped<JwtTokenGenerator>();
        }

        public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            // Add authorization services
            services.AddAuthorization(options =>
            {
                foreach (Role role in Enum.GetValues(typeof(Role)))
                {
                    options.AddPolicy(role.ToString(), policy =>
                        policy.Requirements.Add(new RoleRequirement(role)));
                }
            });

            // JWT Configuration
            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
            services.AddSingleton(jwtSettings);

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                         .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience
                };
            });

            //services.AddAuthorization(options =>
            //{
            //    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
            //    options.AddPolicy("RequireDoctor", policy => policy.RequireRole("Doctor"));
            //    options.AddPolicy("RequirePatient", policy => policy.RequireRole("Patient"));
            //});
        }

        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "SNS24 API",
                    Version = "v1",
                    Description = "API for SNS24 - Sistema de Saude Nacional",
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your token in the text input below.\nExample: 'Bearer 12345abcdef'",
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
        }
    }
}
