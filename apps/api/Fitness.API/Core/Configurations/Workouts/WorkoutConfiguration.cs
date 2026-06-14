using Fitness.API.Features.Workouts.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.Workouts;

public class WorkoutConfiguration : IEntityTypeConfiguration<Workout>
{
    public void Configure(EntityTypeBuilder<Workout> entity)
    {
        entity.HasKey(w => w.Id);

        entity.Property(w => w.Name)
            .IsRequired()
            .HasMaxLength(100);

        entity.HasOne(w => w.Plan)
            .WithMany(p => p.Workouts)
            .HasForeignKey(w => w.PlanId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.Property(p => p.CreatedAt)
            .HasColumnType("datetime")
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        entity.Property(p => p.UpdatedAt)
            .HasColumnType("datetime")
            .ValueGeneratedOnUpdate()
            .HasDefaultValueSql("NULL ON UPDATE CURRENT_TIMESTAMP");

        entity.Property(p => p.DeletedAt)
            .HasColumnType("datetime")
            .HasDefaultValueSql("NULL");
    }
}