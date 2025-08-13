using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BungieCordBlogWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly RoleManager<IdentityRole> roleManager;

        public AuthController(UserManager<IdentityUser> userManager,
            ITokenRepository tokenRepository,
            RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.roleManager = roleManager;
        }

        // POST: {apibaseurl}/api/auth/login
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            // Check Email
            var identityUser = await userManager.FindByEmailAsync(request.Email);

            if (identityUser is not null)
            {
                // Check Password
                var checkPasswordResult = await userManager.CheckPasswordAsync(identityUser, request.Password);

                if (checkPasswordResult)
                {
                    var roles = await userManager.GetRolesAsync(identityUser);

                    // Create a Token and Response
                    var jwtToken = tokenRepository.CreateJwtToken(identityUser, roles.ToList());

                    var response = new LoginResponseDto()
                    {
                        Email = request.Email,
                        Roles = roles.ToList(),
                        Token = jwtToken
                    };

                    return Ok(response);
                }
            }
            ModelState.AddModelError("", "Email or Password Incorrect");


            return ValidationProblem(ModelState);
        }


        // POST: {apibaseurl}/api/auth/register
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            // Create IdentityUser object
            var user = new IdentityUser
            {
                UserName = request.Email?.Trim(),
                Email = request.Email?.Trim()
            };

            // Create User
            var identityResult = await userManager.CreateAsync(user, request.Password);

            if (identityResult.Succeeded)
            {
                // Add Role to user (Reader)
                identityResult = await userManager.AddToRoleAsync(user, "Reader");

                if (identityResult.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    if (identityResult.Errors.Any())
                    {
                        foreach (var error in identityResult.Errors)
                        {
                            ModelState.AddModelError("", error.Description);
                        }
                    }
                }
            }
            else
            {
                if (identityResult.Errors.Any())
                {
                    foreach (var error in identityResult.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }
            }

            return ValidationProblem(ModelState);
        }

        // GET: {apibaseurl}/api/auth/users
        [HttpGet]
        [Route("users")]
        public IActionResult GetAllUsers()
        {
            var users = userManager.Users
                .Select(u => new { u.Id, u.Email, u.UserName })
                .ToList();

            return Ok(users);
        }

        // GET: {apibaseurl}/api/auth/roles
        [HttpGet]
        [Route("roles")]
        public IActionResult GetAllRoles()
        {
            var roles = roleManager.Roles
                .Select(r => new { r.Id, r.Name })
                .ToList();

            return Ok(roles);
        }

        // GET: {apibaseurl}/api/auth/token-details
        [HttpGet]
        [Route("token-details")]
        [Authorize]
        public IActionResult GetTokenDetails()
        {
            // Get the raw token from the Authorization header
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return BadRequest("No JWT token found in Authorization header.");

            var token = authHeader.Substring("Bearer ".Length).Trim();

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            // Group claims by type, allowing multiple values per type
            var claims = jwtToken.Claims
                .GroupBy(c => c.Type)
                .ToDictionary(g => g.Key, g => g.Select(c => c.Value).ToList());

            var tokenDetails = new
            {
                User = claims.TryGetValue(ClaimTypes.Name, out var name) ? name.FirstOrDefault() : null,
                Email = claims.TryGetValue(ClaimTypes.Email, out var email) ? email.FirstOrDefault() : null,
                Roles = claims.TryGetValue(ClaimTypes.Role, out var roles) ? roles : new List<string>(),
                Issuer = jwtToken.Issuer,
                Audience = jwtToken.Audiences.ToList(),
                Expiry = jwtToken.ValidTo,
                Claims = claims
            };

            return Ok(tokenDetails);
        }

    }
}
