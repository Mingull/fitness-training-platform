using Fitness.API.Features.Auth.Utilities;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Fitness.API.Core.Filters;

public class MissingBodyToModelStateFilter : IResourceFilter
{
    public void OnResourceExecuting(ResourceExecutingContext context)
    {
        var request = context.HttpContext.Request;

        var bodyParameter = context.ActionDescriptor.Parameters
            .OfType<ControllerParameterDescriptor>()
            .FirstOrDefault(IsBodyParameter);

        if (bodyParameter is null)
        {
            return;
        }

        // Skip when a body is present, or when transfer length is unknown (e.g. chunked)
        // and may still contain data that model binding should process.
        if (request.ContentLength is > 0)
        {
            return;
        }

        var canHaveBody = context.HttpContext.Features.Get<IHttpRequestBodyDetectionFeature>()?.CanHaveBody;
        var isKnownEmptyBody = request.ContentLength == 0 || canHaveBody == false;

        if (!isKnownEmptyBody)
        {
            return;
        }

        context.ModelState.AddModelError(bodyParameter.Name, "A non-empty request body is required.");
        context.Result = new BadRequestObjectResult(AuthErrors.MapModelStateValidationFailure(context.ModelState));
    }

    public void OnResourceExecuted(ResourceExecutedContext context)
    {
    }

    private static bool IsBodyParameter(ControllerParameterDescriptor parameter)
    {
        if (parameter.BindingInfo?.BindingSource == BindingSource.Body)
        {
            return true;
        }

        return parameter.ParameterInfo
            .GetCustomAttributes(typeof(FromBodyAttribute), inherit: true)
            .Any();
    }
}