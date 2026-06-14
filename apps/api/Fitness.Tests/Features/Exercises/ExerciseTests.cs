using Fitness.API.Core.Utilities;
using Fitness.API.Features.Exercises.Abstract;
using Fitness.API.Features.Exercises.Contracts;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.WorkoutExercises.Abstract;
using Fitness.API.Features.WorkoutExercises.Contracts;
using Fitness.API.Features.Workouts;
using Fitness.API.Features.Workouts.Abstract;
using Fitness.API.Features.Workouts.Contracts;
using Fitness.API.Features.Workouts.Models;
using NSubstitute;

namespace Fitness.Tests.Features.Exercises;

[TestClass]
public sealed class ExerciseTests
{
    [TestMethod]
    public async Task AddExerciseAsync_CreatesExerciseAndLinksItToWorkout()
    {
        var workoutRepository = Substitute.For<IWorkoutRepository>();
        var exerciseService = Substitute.For<IExerciseService>();
        var workoutExerciseService = Substitute.For<IWorkoutExerciseService>();
        var service = new WorkoutService(workoutRepository, exerciseService, workoutExerciseService);
        var userId = Guid.NewGuid();
        var workoutId = Guid.NewGuid();
        var exerciseId = Guid.NewGuid();
        var request = new AddExerciseRequest
        {
            Exercise = new CreateExerciseRequest
            {
                Name = "Bench Press",
                Description = "Flat barbell bench press",
                MediaUrl = "https://example.com/bench.mp4"
            },
            Sets = 4,
            Reps = 8,
            Weight = 80
        };

        var workout = new Workout
        {
            Id = workoutId,
            Name = "Push Day",
            Order = 1,
            Plan = new Plan
            {
                CreatedById = userId,
                Name = "Push Plan",
                Description = "Plan",
                DifficultyLevel = 30,
                EstimatedDuration = 50,
                IsPublic = true
            },
            WorkoutExercises = []
        };

        var updatedWorkout = new Workout
        {
            Id = workoutId,
            Name = workout.Name,
            Order = workout.Order,
            Plan = workout.Plan,
            WorkoutExercises = []
        };

        workoutRepository.GetWorkoutByIdAsync(workoutId).Returns(workout, updatedWorkout);
        exerciseService.CreateExerciseAsync(request.Exercise!, userId).Returns(Result<ExerciseResponse>.Success(new ExerciseResponse
        {
            Id = exerciseId,
            Name = request.Exercise.Name,
            Description = request.Exercise.Description,
            MediaUrl = request.Exercise.MediaUrl,
            CreatedAt = DateTime.UtcNow
        }));
        workoutExerciseService.LinkExerciseToWorkoutAsync(Arg.Any<LinkExerciseRequest>()).Returns(Task.CompletedTask);

        var result = await service.AddExerciseAsync(workoutId, request, userId);

        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual(workoutId, result.Value.Id);
        Assert.AreEqual(workout.Name, result.Value.Name);
        Assert.AreEqual(workout.Order, result.Value.Order);

        await workoutRepository.Received(2).GetWorkoutByIdAsync(workoutId);
        await exerciseService.Received(1).CreateExerciseAsync(request.Exercise!, userId);
        await workoutExerciseService.Received(1).LinkExerciseToWorkoutAsync(Arg.Is<LinkExerciseRequest>(link =>
            link.WorkoutId == workoutId &&
            link.ExerciseId == exerciseId &&
            link.ExerciseOrder == 1 &&
            link.Sets == request.Sets &&
            link.Reps == request.Reps &&
            link.Weight == request.Weight));
    }
}
