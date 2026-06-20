using Fitness.API.Features.TrainerRequests.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.TrainerRequests;

public class TrainerRelationshipConfiguration : IEntityTypeConfiguration<TrainerRelationship>
{
    public void Configure(EntityTypeBuilder<TrainerRelationship> entity)
    {
        entity.HasOne(x => x.Athlete)
            .WithMany()
            .HasForeignKey(x => x.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(x => x.Trainer)
            .WithMany()
            .HasForeignKey(x => x.TrainerId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasIndex(x => x.AthleteId).IsUnique();
    }
}