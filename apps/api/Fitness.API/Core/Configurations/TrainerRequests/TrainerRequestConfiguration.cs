using Fitness.API.Features.TrainerRequests.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.TrainerRequests;

public class TrainerRequestConfiguration : IEntityTypeConfiguration<TrainerRequest>
{
    public void Configure(EntityTypeBuilder<TrainerRequest> entity)
    {
        entity.HasOne(tr => tr.Athlete)
            .WithMany()
            .HasForeignKey(tr => tr.AthleteId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(tr => tr.Trainer)
            .WithMany()
            .HasForeignKey(tr => tr.TrainerId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(x => x.Status)
            .WithMany()
            .HasForeignKey(x => x.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasIndex(x => x.TrainerId);
        entity.HasIndex(x => new { x.AthleteId, x.StatusId });
    }
}