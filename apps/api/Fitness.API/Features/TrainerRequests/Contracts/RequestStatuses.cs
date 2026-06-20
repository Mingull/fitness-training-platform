namespace Fitness.API.Features.TrainerRequests.Contracts;

/// <summary>
/// For quick and dirty usage of request statuses without having to query the database for them.
/// This is not ideal, but it works for now.
/// In a real application, you would want to query the database for these values and cache them.
/// </summary>
/// <param name="id"></param>
/// <param name="value"></param>
/// <param name="label"></param>
public class RequestStatuses(int id, string value, string label)
{
    public int Id { get; } = id;
    public string Value { get; } = value;
    public string Label { get; } = label;
    public static readonly RequestStatuses Pending = new(1, "pending", "Pending");
    public static readonly RequestStatuses Accepted = new(2, "accepted", "Accepted");
    public static readonly RequestStatuses Rejected = new(3, "rejected", "Rejected");
}