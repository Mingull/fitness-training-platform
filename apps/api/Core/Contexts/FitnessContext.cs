using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Plans.Models;
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
    }
}