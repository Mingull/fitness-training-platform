using Fitness.API.Features.Devices.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.Devices;

public class DeviceConfiguration : IEntityTypeConfiguration<Device>
{
    public void Configure(EntityTypeBuilder<Device> entity)
    {
        entity.Property(x => x.Platform)
            .HasConversion<string>();

        entity.HasIndex(d => new { d.UserId, d.ExpoToken })
            .IsUnique();

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