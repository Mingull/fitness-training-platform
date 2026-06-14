using Fitness.API.Features.Exercises.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.Exercises;

public class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> entity)
    {
        entity.HasOne(e => e.CreatedBy)
            .WithMany()
            .HasForeignKey(e => e.CreatedById);

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