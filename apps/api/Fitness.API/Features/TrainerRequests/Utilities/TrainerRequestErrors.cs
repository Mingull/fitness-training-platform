using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.TrainerRequests.Utilities;

public static class TrainerRequestErrors
{
    public static ApiError RequestNotFound { get; } = new("RequestNotFound", ErrorType.NotFound, "Request not found", "The requested trainer request was not found.");
    public static ApiError RequestSentToSelf { get; } = new("RequestSentToSelf", ErrorType.BadRequest, "Cannot send request to self", "You cannot send a trainer request to yourself.");
    public static ApiError AthleteNotFound { get; } = new("NoAthleteFound", ErrorType.NotFound, "Athlete not found", "The requested athlete was not found.");
    public static ApiError AthleteNotSporter { get; } = new("AthleteNotSporter", ErrorType.Forbidden, "Athlete not a sporter", "The selected athlete does not have the 'Sporter' role.");
    public static ApiError TrainerNotFound { get; } = new("NoTrainerFound", ErrorType.NotFound, "Trainer not found", "The requested trainer was not found.");
    public static ApiError SelectedUserNotTrainer { get; } = new("SelectedUserNotTrainer", ErrorType.BadRequest, "Selected user is not a trainer", "You cannot send a trainer request to a user who is not a trainer.");
    public static ApiError AuthUserNotTrainer { get; } = new("UserNotTrainer", ErrorType.Unauthorized, "Authenticated user is not a trainer", "You are not authorized to perform this action because you are not a trainer.");
    public static ApiError RequestAlreadyExists { get; } = new("RequestAlreadyExists", ErrorType.BadRequest, "Request already exists", "A trainer request to this user already exists.");
    public static ApiError ActiveTrainerExists { get; } = new("ActiveTrainerExists", ErrorType.BadRequest, "You already have an active trainer", "You cannot send a trainer request while having an active trainer.");
    public static ApiError InvalidRequestState(string status) => new("InvalidRequestState", ErrorType.BadRequest, "Invalid request state", $"Only pending requests can be {status}.");
    public static ApiError SomethingWentWrong { get; } = new("SomethingWentWrong", ErrorType.BadRequest, "Something went wrong", "An unexpected error occurred. Please try again later.");
}
