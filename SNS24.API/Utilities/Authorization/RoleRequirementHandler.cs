﻿using Microsoft.AspNetCore.Authorization;
using SNS24.WebApi.Enums;
using System.Security.Claims;

namespace SNS24.WebApi.Utilities.Authorization
{
    public class RoleRequirement : IAuthorizationRequirement
    {
        public Role MinimumRole { get; }

        public RoleRequirement(Role minimumRole)
        {
            MinimumRole = minimumRole;
        }
    }

    public class RoleRequirementHandler : AuthorizationHandler<RoleRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RoleRequirement requirement)
        {
            var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;
            if (Enum.TryParse(roleClaim, out Role userRole) && userRole >= requirement.MinimumRole)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
