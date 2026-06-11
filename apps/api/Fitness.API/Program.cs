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

            if (environment.IsDevelopment())
            {
                await dbContext.Database.MigrateAsync();
            }

            await IdentitySeeder.SeedRoles(roleManager);
        }

        await host.RunAsync();
    }
}
