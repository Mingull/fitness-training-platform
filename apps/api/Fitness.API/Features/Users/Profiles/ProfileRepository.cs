using Fitness.API.Core.Contexts;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Features.Profiles.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Profiles;

public class ProfileRepository(FitnessContext context) : IProfileRepository
{
    public async Task<Profile> CreateAsync(Profile profile)
    {
        context.Profiles.Add(profile);
        await context.SaveChangesAsync();
        return profile;
    }

    public async Task<Profile?> GetByUserIdAsync(Guid userId)
    {
        return await context.Profiles.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task<IEnumerable<Profile>> GetAllAsync()
    {
        return await context.Profiles.Include(p => p.User).ToListAsync();
    }

    public async Task UpdateAsync(Profile profile)
    {
        context.Entry(profile).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }
}