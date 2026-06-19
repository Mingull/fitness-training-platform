using Fitness.API.Features.Notifications.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.Notifications;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> entity)
    {
        entity.Property(x => x.Type)
            .HasConversion<string>();

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
