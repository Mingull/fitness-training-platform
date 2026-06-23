using Fitness.API.Core.Contexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API;

public class Program
{
    public static async Task Main(string[] args)
    {
        var host = Host
           .CreateDefaultBuilder(args)
           .ConfigureWebHostDefaults(webBuilder =>
           {
               webBuilder.UseStartup<Startup>();
           })
           .Build();

        using (var scope = host.Services.CreateScope())
        {
            var services = scope.ServiceProvider;

            var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var dbContext = services.GetRequiredService<FitnessContext>();
            var environment = services.GetRequiredService<IHostEnvironment>();
            var configuration = services.GetRequiredService<IConfiguration>();

            var logger = services.GetRequiredService<ILogger<Program>>();
            var runMigrations = configuration.GetValue("RUN_MIGRATIONS", false);
            if (environment.IsDevelopment() || runMigrations)
            {
                logger.LogInformation("Running database migrations...");
                await dbContext.Database.MigrateAsync();
                await IdentitySeeder.SeedRoles(roleManager);
                logger.LogInformation("Database migrations completed.");
            }
        }

        await host.RunAsync();
    }
}
