using Fitness.API.Features.Profiles.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.Profiles;

public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    public void Configure(EntityTypeBuilder<Profile> entity)
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
    }
}