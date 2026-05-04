namespace Fitness.API.Features.Auth.Models;

public static class Roles
{
    public const string Admin = "Admin";
    public const string Trainer = "Trainer";
    public const string Sporter = "Sporter";

    public static readonly string[] All = [Admin, Trainer, Sporter];
}