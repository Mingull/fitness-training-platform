using Fitness.API.Features.Notifications.Contracts;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Fitness.API.Features.Notifications;

public class ExpoPushService(HttpClient http)
{
    private static readonly JsonSerializerOptions ExpoSerializerOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public async Task SendAsync(NotificationPayload payload, CancellationToken ct = default)
    {
        var response = await http.PostAsJsonAsync(
            "https://exp.host/--/api/v2/push/send",
            new[] { payload },
            ExpoSerializerOptions,
            ct
        );

        var content = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            throw new ExpoPushException($"Expo push failed ({response.StatusCode}): {content}");
        }

        try
        {
            using var document = JsonDocument.Parse(content);
            if (!document.RootElement.TryGetProperty("data", out var dataElement) || dataElement.ValueKind != JsonValueKind.Array)
            {
                return;
            }

            foreach (var ticket in dataElement.EnumerateArray())
            {
                if (!ticket.TryGetProperty("status", out var statusElement))
                {
                    continue;
                }

                if (!string.Equals(statusElement.GetString(), "error", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var message = ticket.TryGetProperty("message", out var messageElement) ? messageElement.GetString() : "Unknown Expo ticket error.";
                var details = ticket.TryGetProperty("details", out var detailsElement) ? detailsElement.GetRawText() : null;

                throw new ExpoPushException($"Expo push ticket error: {message}. Details: {details}");
            }
        }
        catch (JsonException ex)
        {
            throw new ExpoPushException($"Expo push response could not be parsed. Payload: {content}. Error: {ex.Message}");
        }
    }
}

public class ExpoPushException(string message) : Exception(message)
{
}