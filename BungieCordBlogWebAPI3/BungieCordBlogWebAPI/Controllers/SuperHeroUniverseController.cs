using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text.Json.Serialization;

[ApiController]
[Route("api/[controller]")]
public class SuperHeroUniverseController : ControllerBase
{
    private readonly ISuperHeroRepository superHeroRepository;
    private readonly ISuperPowerRepository superPowerRepository;
    private readonly ISidekickRepository sidekickRepository;
    private readonly IComicAppearanceRepository comicAppearanceRepository;
    private readonly ISidekickComicAppearanceRepository sidekickComicAppearanceRepository;
    private readonly UserManager<IdentityUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;

    public SuperHeroUniverseController(
        ISuperHeroRepository superHeroRepository,
        ISuperPowerRepository superPowerRepository,
        ISidekickRepository sidekickRepository,
        IComicAppearanceRepository comicAppearanceRepository,
        ISidekickComicAppearanceRepository sidekickComicAppearanceRepository,
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        this.superHeroRepository = superHeroRepository;
        this.superPowerRepository = superPowerRepository;
        this.sidekickRepository = sidekickRepository;
        this.comicAppearanceRepository = comicAppearanceRepository;
        this.sidekickComicAppearanceRepository = sidekickComicAppearanceRepository;
        this.userManager = userManager;
        this.roleManager = roleManager;
    }

    #region cycle error

    //System.Text.Json.JsonException: A possible object cycle was detected.This can either be due to a cycle
    //or if the object depth is larger than the maximum allowed depth of 32.
    //Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. 
    //Path: $.Hero.SuperPowers.SuperHero.SuperPowers.SuperHero.SuperPowers.SuperHero.SuperPowers.SuperHero.
    //SuperPowers.SuperHero.SuperPowers.SuperHero.SuperPowers.SuperHero.SuperPowers.SuperHero.SuperPowers.
    //SuperHero.SuperPowers.Id.

    //Solution 1, use DTOS (check the endpoint below which replaces this one)

    //Solution 2, use ReferenceHandler.Preserve 

    //builder.Services.AddControllers()
    //.AddJsonOptions(options =>
    //{
    //    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    //});



    // Example endpoint: Get all superheroes with their powers
    //[HttpGet("heroes-with-powers")]
    //public async Task<IActionResult> GetHeroesWithPowers()
    //{
    //    var heroes = await superHeroRepository.GetAllAsync();
    //    var powers = await superPowerRepository.GetAllAsync();

    //    var result = heroes.Select(hero => new
    //    {
    //        Hero = hero,
    //        Powers = powers.Where(p => p.SuperHeroId == hero.Id)
    //    });

    //    return Ok(result);
    //}


    #endregion
    // Add more endpoints as needed, combining data from any repositories above

    [HttpGet("heroes-with-powers")]
    public async Task<IActionResult> GetHeroesWithPowers()
    {
        var heroes = await superHeroRepository.GetAllAsync();
        var powers = await superPowerRepository.GetAllAsync();

        var result = heroes.Select(hero => new
        {
            Hero = new SuperHeroDto
            {
                Id = hero.Id,
                Name = hero.Name,
                Alias = hero.Alias,
                Age = hero.Age,
                Origin = hero.Origin,
                FirstAppearance = hero.FirstAppearance,
                IsActive = hero.IsActive
            },
            Powers = powers
                .Where(p => p.SuperHeroId == hero.Id)
                .Select(p => new SuperPowerDto
                {
                    Id = p.Id,
                    PowerName = p.PowerName,
                    Description = p.Description,
                    SuperHeroId = p.SuperHeroId
                })
                .ToList()
        });

        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("Search term cannot be empty.");

        // SuperHeroes
        var heroes = await superHeroRepository.GetAllAsync();
        var heroResults = heroes
            .Where(h =>
                (h.Name != null && h.Name.Contains(q, StringComparison.OrdinalIgnoreCase)) ||
                (h.Alias != null && h.Alias.Contains(q, StringComparison.OrdinalIgnoreCase)) ||
                (h.Origin != null && h.Origin.Contains(q, StringComparison.OrdinalIgnoreCase)))
            .Select(h => new SuperHeroDto
            {
                Id = h.Id,
                Name = h.Name,
                Alias = h.Alias,
                Age = h.Age,
                Origin = h.Origin,
                FirstAppearance = h.FirstAppearance,
                IsActive = h.IsActive
            })
            .ToList();

        if (!heroResults.Any())
        {
            heroResults.Add(new SuperHeroDto
            {
                Id = Guid.Empty,
                Name = "No results",
                Alias = "",
                Age = 0,
                Origin = "",
                FirstAppearance = DateTime.MinValue,
                IsActive = false
            });
        }

        // SuperPowers
        var powers = await superPowerRepository.GetAllAsync();
        var powerResults = powers
            .Where(p =>
                (p.PowerName != null && p.PowerName.Contains(q, StringComparison.OrdinalIgnoreCase)) ||
                (p.Description != null && p.Description.Contains(q, StringComparison.OrdinalIgnoreCase)))
            .Select(p => new SuperPowerDto
            {
                Id = p.Id,
                PowerName = p.PowerName,
                Description = p.Description,
                SuperHeroId = p.SuperHeroId
            })
            .ToList();

        if (!powerResults.Any())
        {
            powerResults.Add(new SuperPowerDto
            {
                Id = Guid.Empty,
                PowerName = "No results",
                Description = "",
                SuperHeroId = Guid.Empty
            });
        }

        // Sidekicks
        var sidekicks = await sidekickRepository.GetAllAsync();
        var sidekickResults = sidekicks
            .Where(s =>
                (s.Name != null && s.Name.Contains(q, StringComparison.OrdinalIgnoreCase)))
            .Select(s => new
            {
                Id = s.Id,
                Name = s.Name,
                Age = s.Age,
                SuperHeroId = s.SuperHeroId
            })
            .ToList();

        if (!sidekickResults.Any())
        {
            sidekickResults.Add(new
            {
                Id = Guid.Empty,
                Name = "No results",
                Age = 0,
                SuperHeroId = Guid.Empty
            });
        }

        // ComicAppearances
        var comics = await comicAppearanceRepository.GetAllAsync();
        var comicResults = comics
            .Where(c =>
                (c.ComicTitle != null && c.ComicTitle.Contains(q, StringComparison.OrdinalIgnoreCase)))
            .Select(c => new
            {
                Id = c.Id,
                ComicTitle = c.ComicTitle,
                IssueNumber = c.IssueNumber,
                ReleaseDate = c.ReleaseDate,
                SuperHeroId = c.SuperHeroId
            })
            .ToList();

        if (!comicResults.Any())
        {
            comicResults.Add(new
            {
                Id = Guid.Empty,
                ComicTitle = "No results",
                IssueNumber = 0,
                ReleaseDate = DateTime.MinValue,
                SuperHeroId = Guid.Empty
            });
        }

        // SidekickComicAppearances
        var sidekickComicAppearances = await sidekickComicAppearanceRepository.GetAllAsync();
        var sidekickComicResults = sidekickComicAppearances
            .Where(sca =>
                sidekickResults.Any(sk => sk.Id == sca.SidekickId) ||
                comicResults.Any(cm => cm.Id == sca.ComicAppearanceId))
            .Select(sca => new
            {
                SidekickId = sca.SidekickId,
                ComicAppearanceId = sca.ComicAppearanceId
            })
            .ToList();

        if (!sidekickComicResults.Any())
        {
            sidekickComicResults.Add(new
            {
                SidekickId = Guid.Empty,
                ComicAppearanceId = Guid.Empty
            });
        }

        var result = new
        {
            SuperHeroes = heroResults,
            SuperPowers = powerResults,
            Sidekicks = sidekickResults,
            ComicAppearances = comicResults,
            SidekickComicAppearances = sidekickComicResults
        };

        return Ok(result);
    }

    [HttpGet("admin-summary")]
    public async Task<IActionResult> GetAdminSummary()
    {
        var superHeroCount = (await superHeroRepository.GetAllAsync()).Count();
        var superPowerCount = (await superPowerRepository.GetAllAsync()).Count();
        var sidekickCount = (await sidekickRepository.GetAllAsync()).Count();
        var comicAppearanceCount = (await comicAppearanceRepository.GetAllAsync()).Count();
        var sidekickComicAppearanceCount = (await sidekickComicAppearanceRepository.GetAllAsync()).Count();
        var userCount = userManager.Users.Count();
        var roleCount = roleManager.Roles.Count();

        var summary = new AdminSummaryStatsDto
        {
            SuperHeroCount = superHeroCount,
            SuperPowerCount = superPowerCount,
            SidekickCount = sidekickCount,
            ComicAppearanceCount = comicAppearanceCount,
            SidekickComicAppearanceCount = sidekickComicAppearanceCount,
            UserCount = userCount,
            RoleCount = roleCount
        };

        return Ok(summary);
    }
}