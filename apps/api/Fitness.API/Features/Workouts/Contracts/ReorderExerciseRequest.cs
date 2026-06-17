namespace Fitness.API.Features.Workouts.Contracts;

// It should be exercise id and new order index,
// as just having an list of exercise ids could be in the wrong order that the client intended,
// so we need to have the new order index for each exercise id
public record ReorderExerciseRequest
{
    public Guid ExerciseId { get; init; }
    public int NewOrderIndex { get; init; }
}