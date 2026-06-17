namespace Fitness.API.Features.Plans.Contracts;

// It should be workout id and new order index,
// as just having an list of workout ids could be in the wrong order that the client intended,
// so we need to have the new order index for each workout id
public record ReorderWorkoutRequest
{
    public Guid WorkoutId { get; init; }
    public int NewOrderIndex { get; init; }
}