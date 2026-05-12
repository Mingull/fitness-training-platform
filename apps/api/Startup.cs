using System.Text;
using Fitness.API.Core;
using Fitness.API.Core.Contexts;
using Fitness.API.Features.Auth;
using Fitness.API.Features.Auth.Abstract;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Auth.Utilities;
using Fitness.API.Features.Profiles;
using Fitness.API.Features.Profiles.Abstract;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Fitness.API;

public class Startup(IConfiguration configuration)
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            if (env.IsDevelopment())
            {
                endpoints.MapOpenApi();
            }
        });

        app.UseHttpsRedirection();
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services
            .AddControllers()
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                    new BadRequestObjectResult(AuthErrors.MapModelStateValidationFailure(context.ModelState));
            });
        services.AddOpenApi();

        ConfigureDatabase(services);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters.ValidIssuer = configuration["Jwt:Issuer"];
            options.TokenValidationParameters.ValidAudience = configuration["Jwt:Audience"];
            options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]!));
            options.MapInboundClaims = false; // to prevent the default mapping of claim types to Microsoft-specific ones
        });

        services.AddAuthorization();
        services.AddHttpContextAccessor();

        // Add dependency injection here
        InitializeRepositories(services);
        InitializeServices(services);
    }

    public void ConfigureDatabase(IServiceCollection services)
    {
        var connectionString = configuration.GetConnectionString("DatabaseUrl");

        services.AddDbContextFactory<FitnessContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).UseSnakeCaseNamingConvention());
        services.AddIdentity<AppUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequiredLength = 8;
            })
            .AddEntityFrameworkStores<FitnessContext>()
            .AddDefaultTokenProviders();
    }

    private void InitializeRepositories(IServiceCollection services)
    {
        services.AddScoped<IAuthRepository, AuthRepository>() // for repositories that should be created per request
            .AddScoped<IProfileRepository, ProfileRepository>();
        // services.AddSingleton<IRepository, Repository>() for repositories that should be created once and shared across the application
    }
    private void InitializeServices(IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>() // for services that should be created per request
            .AddScoped<IProfileService, ProfileService>()
            .AddSingleton<TokenProvider>(); // for services that should be created once and shared across the application
    }
}