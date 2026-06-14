using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Plans;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Profiles.Models;
using NSubstitute;

namespace Fitness.Tests.Features.Plans;

[TestClass]
public sealed class PlanTests
{
    [TestMethod]
    public async Task CreatePlanAsync_CreatesPlanAndMapsCreatorDetails()
    {
        var planRepository = Substitute.For<IPlanRepository>();
        var service = new PlanService(planRepository);
        var creatorId = Guid.NewGuid();
        var request = new CreatePlanRequest
        {
            Name = "Strength Plan",
            Description = "A simple strength-building plan",
            Difficulty = 25,
            EstimatedDuration = 45,
            IsPublic = true
        };

        var createdPlan = new Plan
        {
            Id = Guid.NewGuid(),
            CreatedById = creatorId,
            CreatedBy = new AppUser
            {
                Id = creatorId,
                UserName = "coach",
                Profile = new Profile
                {
                    PictureUrl = "https://example.com/coach.png"
                }
            },
            Name = request.Name,
            Description = request.Description,
            DifficultyLevel = request.Difficulty,
            EstimatedDuration = request.EstimatedDuration,
            IsPublic = request.IsPublic
        };

        planRepository.CreatePlanAsync(Arg.Any<Plan>()).Returns(createdPlan);

        var result = await service.CreatePlanAsync(request, creatorId);

        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual(createdPlan.Id, result.Value.Id);
        Assert.AreEqual(request.Name, result.Value.Name);
        Assert.AreEqual(request.Description, result.Value.Description);
        Assert.AreEqual(request.Difficulty, result.Value.Difficulty.Level);
        Assert.AreEqual("novice", result.Value.Difficulty.Label);
        Assert.AreEqual(request.EstimatedDuration, result.Value.EstimatedDuration);
        Assert.AreEqual(request.IsPublic, result.Value.IsPublic);
        Assert.AreEqual(creatorId, result.Value.Creator.Id);
        Assert.AreEqual("coach", result.Value.Creator.Username);
        Assert.AreEqual("https://example.com/coach.png", result.Value.Creator.PictureUrl);

        await planRepository.Received(1).CreatePlanAsync(Arg.Is<Plan>(plan =>
            plan.CreatedById == creatorId &&
            plan.Name == request.Name &&
            plan.Description == request.Description &&
            plan.DifficultyLevel == request.Difficulty &&
            plan.EstimatedDuration == request.EstimatedDuration &&
            plan.IsPublic == request.IsPublic));
    }
}
