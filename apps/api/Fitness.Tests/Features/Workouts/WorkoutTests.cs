using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Plans;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Workouts.Models;
using NSubstitute;

namespace Fitness.Tests.Features.Workouts;

[TestClass]
public sealed class WorkoutTests
{
    [TestMethod]
    public async Task AddWorkoutToPlanAsync_AddsWorkoutAtNextOrderAndReturnsUpdatedPlan()
    {
        var planRepository = Substitute.For<IPlanRepository>();
        var service = new PlanService(planRepository);
        var userId = Guid.NewGuid();
        var planId = Guid.NewGuid();
        var request = new AddWorkoutRequest
        {
            Name = "Leg Day"
        };

        var firstWorkout = new Workout
        {
            Id = Guid.NewGuid(),
            Name = "Warmup",
            Order = 1
        };

        var secondWorkout = new Workout
        {
            Id = Guid.NewGuid(),
            Name = "Main Session",
            Order = 2
        };

        var addedWorkout = new Workout
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Order = 3
        };

        var initialPlan = new Plan
        {
            Id = planId,
            CreatedById = userId,
            CreatedBy = new AppUser { Id = userId, UserName = "owner" },
            Name = "Spring Bulk",
            Description = "Training plan",
            DifficultyLevel = 40,
            EstimatedDuration = 60,
            IsPublic = true,
            Workouts = [firstWorkout, secondWorkout]
        };

        var updatedPlan = new Plan
        {
            Id = planId,
            CreatedById = userId,
            CreatedBy = new AppUser { Id = userId, UserName = "owner" },
            Name = "Spring Bulk",
            Description = "Training plan",
            DifficultyLevel = 40,
            EstimatedDuration = 60,
            IsPublic = true,
            Workouts = [firstWorkout, secondWorkout, addedWorkout]
        };

        planRepository.GetByIdAsync(planId, true).Returns(initialPlan, updatedPlan);
        planRepository.AddWorkoutAsync(planId, Arg.Any<Workout>()).Returns(Task.CompletedTask);

        var result = await service.AddWorkoutToPlanAsync(planId, request, userId);

        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual(planId, result.Value.Id);
        Assert.HasCount(3, result.Value.Workouts);
        Assert.AreEqual(request.Name, result.Value.Workouts.Last().Name);
        Assert.AreEqual(3, result.Value.Workouts.Last().Order);

        await planRepository.Received(2).GetByIdAsync(planId, true);
        await planRepository.Received(1).AddWorkoutAsync(planId, Arg.Is<Workout>(workout =>
            workout.Name == request.Name &&
            workout.Order == 3));
    }
}
