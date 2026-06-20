using Fitness.API.Features.TrainerRequests.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fitness.API.Core.Configurations.TrainerRequests;

public class RequestStatusConfiguration : IEntityTypeConfiguration<RequestStatus>
{
    public void Configure(EntityTypeBuilder<RequestStatus> entity)
    {
        entity.HasKey(x => x.Id);

        entity.HasData(
            new RequestStatus { Id = 1, Value = "pending", Label = "Pending" },
            new RequestStatus { Id = 2, Value = "accepted", Label = "Accepted" },
            new RequestStatus { Id = 3, Value = "rejected", Label = "Rejected" }
        );
    }
}