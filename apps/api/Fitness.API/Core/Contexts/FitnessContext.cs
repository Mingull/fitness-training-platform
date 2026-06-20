using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Exercises.Models;
using Fitness.API.Features.Workouts.Models;
using Fitness.API.Features.Profiles.Models;
using Fitness.API.Features.WorkoutExercises.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Fitness.API.Features.Notifications.Models;
using Fitness.API.Features.Devices.Models;
using Fitness.API.Features.TrainerRequests.Models;

namespace Fitness.API.Core.Contexts;

public sealed class FitnessContext(DbContextOptions<FitnessContext> options) : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Plan> Plans => Set<Plan>();
    public DbSet<ActiveUserPlan> ActiveUserPlans => Set<ActiveUserPlan>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Device> Devices => Set<Device>();
    public DbSet<TrainerRequest> TrainerRequests => Set<TrainerRequest>();
    public DbSet<TrainerRelationship> TrainerRelationships => Set<TrainerRelationship>();
    public DbSet<RequestStatus> RequestStatuses => Set<RequestStatus>();
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>().ToTable("users");
        builder.Entity<IdentityRole<Guid>>().ToTable("roles");
        builder.Entity<IdentityUserRole<Guid>>().ToTable("user_roles");
        builder.Entity<IdentityUserClaim<Guid>>().ToTable("user_claims");
        builder.Entity<IdentityUserLogin<Guid>>().ToTable("user_logins");
        builder.Entity<IdentityUserToken<Guid>>().ToTable("user_tokens");
        builder.Entity<IdentityRoleClaim<Guid>>().ToTable("role_claims");

        builder.ApplyConfigurationsFromAssembly(typeof(FitnessContext).Assembly);
    }
}