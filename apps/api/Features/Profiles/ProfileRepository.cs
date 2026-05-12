using Fitness.API.Core.Contexts;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Features.Profiles.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Profiles;

public class ProfileRepository(FitnessContext context) : IProfileRepository
{
    public async Task<Profile?> GetByUserIdAsync(Guid userId)
    {
        return await context.Profiles.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == userId);
    }
}