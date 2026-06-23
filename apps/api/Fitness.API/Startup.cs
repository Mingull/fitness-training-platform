using System.Text;
using Fitness.API.Core;
using Fitness.API.Core.Filters;
using Fitness.API.Core.Contexts;
using Fitness.API.Features.Auth;
using Fitness.API.Features.Auth.Abstract;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Auth.Utilities;
using Fitness.API.Features.Profiles;
using Fitness.API.Features.Profiles.Abstract;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Fitness.API.Features.Plans;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Exercises.Abstract;
using Fitness.API.Features.Exercises;
using Fitness.API.Features.Workouts.Abstract;
using Fitness.API.Features.Workouts;
using Fitness.API.Features.WorkoutExercises.Abstract;
using Fitness.API.Features.WorkoutExercises;
using Fitness.API.Features.Devices.Abstract;
using Fitness.API.Features.Devices;
using Fitness.API.Features.Notifications.Abstract;
using Fitness.API.Features.Notifications;
using Fitness.API.Features.TrainerRequests.Abstract;
using Fitness.API.Features.TrainerRequests;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Server.Kestrel.Core;

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
            endpoints.MapHub<NotificationHub>("/hubs/notifications");
            if (env.IsDevelopment())
            {
                endpoints.MapOpenApi();
            }
            endpoints.MapHealthChecks("/health");
        });

        app.UseHttpsRedirection();
    }

    public void ConfigureServices(IServiceCollection services)
    {
        const long maxRequestBodySize = 5 * 1024 * 1024;

        services.Configure<KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = maxRequestBodySize;
        });

        services.Configure<IISServerOptions>(options =>
        {
            options.MaxRequestBodySize = maxRequestBodySize;
        });

        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services
            .AddControllers(options =>
            {
                options.Filters.Add<MissingBodyToModelStateFilter>();
            })
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                    new BadRequestObjectResult(AuthErrors.MapModelStateValidationFailure(context.ModelState));
            });
        services.AddOpenApi();
        services.AddSignalR();

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

            // SignalR clients cannot set HTTP headers reliably across all transports
            // (e.g. long polling), so they pass the JWT via the "access_token" query
            // string. Read it here so the hub endpoint can be authenticated.
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var path = context.HttpContext.Request.Path;

                    if (!path.StartsWithSegments("/hubs/notifications"))
                    {
                        return Task.CompletedTask;
                    }

                    var accessToken = context.Request.Query["access_token"];
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        context.Token = accessToken;
                        return Task.CompletedTask;
                    }

                    var authorizationHeader = context.Request.Headers[HeaderNames.Authorization].ToString();
                    if (authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        context.Token = authorizationHeader["Bearer ".Length..].Trim();
                    }

                    return Task.CompletedTask;
                },
            };
        });
        services.AddHealthChecks();

        services.AddAuthorization();
        services.AddHttpContextAccessor();

        // Add dependency injection here

        services.AddHttpClient<ExpoPushService>(); // for sending push notifications to Expo devices
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
            .AddScoped<IProfileRepository, ProfileRepository>()
            .AddScoped<IPlanRepository, PlanRepository>()
            .AddScoped<IExerciseRepository, ExerciseRepository>()
            .AddScoped<IWorkoutRepository, WorkoutRepository>()
            .AddScoped<IWorkoutExerciseRepository, WorkoutExerciseRepository>()
            .AddScoped<IDeviceRepository, DeviceRepository>()
            .AddScoped<INotificationRepository, NotificationRepository>()
            .AddScoped<ITrainerRequestRepository, TrainerRequestRepository>();
        // services.AddSingleton<IRepository, Repository>() for repositories that should be created once and shared across the application
    }
    private void InitializeServices(IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>() // for services that should be created per request
            .AddScoped<IProfileService, ProfileService>()
            .AddScoped<IPlanService, PlanService>()
            .AddScoped<IWorkoutService, WorkoutService>()
            .AddScoped<IExerciseService, ExerciseService>()
            .AddScoped<IWorkoutExerciseService, WorkoutExerciseService>()
            .AddScoped<IDeviceService, DeviceService>()
            .AddScoped<INotificationService, NotificationService>()
            .AddScoped<ITrainerRequestService, TrainerRequestService>()
            .AddSingleton<TokenProvider>() // for services that should be created once and shared across the application
            .AddTransient<NotificationHub>(); // for services that should be created each time they are requested (e.g., SignalR hubs)
    }
}