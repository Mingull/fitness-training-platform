using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Plans.Workouts.Exercises.Models;
using Fitness.API.Features.Plans.Workouts.Models;
using Fitness.API.Features.Profiles.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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

        builder.Entity<Profile>(entity =>
        {
            entity.HasOne(p => p.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<Profile>(p => p.UserId);

            entity.Property(p => p.ExperienceLevel)
                .HasConversion(v => v.Value, v => ExperienceLevel.From(v))
                .HasColumnType("varchar(50)")
                .HasMaxLength(50)
                .HasDefaultValue(ExperienceLevel.Beginner);

            entity.Property(p => p.CreatedAt)
                .HasColumnType("datetime")
                .ValueGeneratedOnAdd()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(p => p.UpdatedAt)
                .HasColumnType("datetime")
                .ValueGeneratedOnUpdate()
                .HasDefaultValueSql("NULL ON UPDATE CURRENT_TIMESTAMP");
        });

        builder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany()
            .HasForeignKey(rt => rt.UserId);

        builder.Entity<Plan>(entity =>
        {
            entity.Property(p => p.DifficultyLevel)
                .HasColumnType("int")
                .HasDefaultValue(0);

            entity.Property(p => p.CreatedAt)
                .HasColumnType("datetime")
                .ValueGeneratedOnAdd()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(p => p.UpdatedAt)
                .HasColumnType("datetime")
                .ValueGeneratedOnUpdate()
                .HasDefaultValueSql("NULL ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(p => p.CreatedBy)
                .WithMany()
                .HasForeignKey(p => p.CreatedById);

            entity.HasMany(p => p.Workouts)
                .WithOne(w => w.Plan)
                .HasForeignKey(w => w.PlanId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ActiveUserPlan>(entity =>
        {
            entity.HasIndex(x => x.UserId)
                 .IsUnique();

            entity.HasOne(x => x.User)
                .WithOne()
                .HasForeignKey<ActiveUserPlan>(x => x.UserId);

            entity.HasOne(x => x.Plan)
                .WithMany()
                .HasForeignKey(x => x.PlanId);

            entity.Property(x => x.ActivatedAt)
                .HasColumnType("datetime")
                .ValueGeneratedOnAdd()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        builder.Entity<WorkoutExercise>(entity =>
        {
            entity.HasOne(we => we.Workout)
                .WithMany(w => w.WorkoutExercises)
                .HasForeignKey(we => we.WorkoutId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(we => we.Exercise)
                .WithMany(e => e.WorkoutExercises)
                .HasForeignKey(we => we.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

        });

        builder.Entity<Exercise>()
            .HasOne(e => e.CreatedBy)
            .WithMany()
            .HasForeignKey(e => e.CreatedById);
    }
}