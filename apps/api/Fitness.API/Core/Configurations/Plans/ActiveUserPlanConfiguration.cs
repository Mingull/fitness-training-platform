using Fitness.API.Features.Plans.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.Plans;

public class ActiveUserPlanConfiguration : IEntityTypeConfiguration<ActiveUserPlan>
{
    public void Configure(EntityTypeBuilder<ActiveUserPlan> entity)
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
    }
}