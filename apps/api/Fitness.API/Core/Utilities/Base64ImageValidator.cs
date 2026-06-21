using System.Globalization;

namespace Fitness.API.Core.Utilities;

public static class Base64ImageValidator
{
    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/gif"
    };

    public static bool TryNormalizeImageBase64(
        string? input,
        int maxDecodedBytes,
        out string? normalizedDataUri,
        out string? error)
    {
        normalizedDataUri = null;
        error = null;

        if (string.IsNullOrWhiteSpace(input))
        {
            return true; // optional field
        }

        var raw = input.Trim();
        var mimeType = "image/jpeg";
        var base64Payload = raw;

        if (raw.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
        {
            var commaIndex = raw.IndexOf(',');
            if (commaIndex <= 5)
            {
                error = "Invalid data URI format.";
                return false;
            }

            var metadata = raw[5..commaIndex];
            if (!metadata.Contains(";base64", StringComparison.OrdinalIgnoreCase))
            {
                error = "Data URI must contain ;base64.";
                return false;
            }

            var semicolonIndex = metadata.IndexOf(';');
            var parsedMime = semicolonIndex > 0 ? metadata[..semicolonIndex] : metadata;

            if (!AllowedMimeTypes.Contains(parsedMime))
            {
                error = "Unsupported image type.";
                return false;
            }

            mimeType = parsedMime;
            base64Payload = raw[(commaIndex + 1)..];
        }

        byte[] buffer;
        try
        {
            buffer = Convert.FromBase64String(base64Payload);
        }
        catch (FormatException)
        {
            error = "Image must be valid Base64.";
            return false;
        }

        if (buffer.Length == 0)
        {
            error = "Image is empty.";
            return false;
        }

        if (buffer.Length > maxDecodedBytes)
        {
            error = $"Image is too large. Max allowed is {maxDecodedBytes.ToString(CultureInfo.InvariantCulture)} bytes.";
            return false;
        }

        normalizedDataUri = $"data:{mimeType};base64,{base64Payload}";
        return true;
    }
}