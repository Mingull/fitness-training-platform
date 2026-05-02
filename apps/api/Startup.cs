using Fitness.API.Abstract.Services;
using Fitness.API.Contexts;
using Fitness.API.Models;
using Fitness.API.Services;
using Fitness.API.Utilities;
using Fitness.API.Utilities.Errors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        services
            .AddControllers()
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                    new BadRequestObjectResult(AuthErrors.MapModelStateValidationFailure(context.ModelState));
            });
        services.AddOpenApi();

        ConfigureDatabase(services);

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
        // services.AddScoped<IRepository, Repository>() for repositories that should be created per request
        // services.AddSingleton<IRepository, Repository>() for repositories that should be created once and shared across the application
    }
    private void InitializeServices(IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>(); // for services that should be created per request
        // services.AddSingleton<IService, Service>() for services that should be created once and shared across the application
    }
}