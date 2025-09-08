using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories;
using BungieCordBlogWebAPI.Repositories.Implementation;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BungieCordBlogWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IUserExtraInfoRepository userExtraInfoRepository;

        // Add this field to the controller
        private readonly IPaymentRepository paymentRepository;

        // Update the constructor to accept IPaymentRepository
        public AuthController(UserManager<IdentityUser> userManager,
            ITokenRepository tokenRepository,
            RoleManager<IdentityRole> roleManager,
            IPaymentRepository paymentRepository,
            IUserExtraInfoRepository userExtraInfoRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.roleManager = roleManager;
            this.paymentRepository = paymentRepository;
            this.userExtraInfoRepository = userExtraInfoRepository;
        }

        // In the Login method, after creating the response, check for basket and create if not exists
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

                    var response = new LogoResponseDto2()
                    {
                        Email = request.Email,
                        Roles = roles.ToList(),
                        Token = jwtToken,
                        OrderBasketId = Guid.Empty // Placeholder, will be set below if basket exists or is created
                    };

                    // Check if the current user has a basket, if not, create one for them

                    // Convert identityUser.Id (string) to Guid
                    if (!Guid.TryParse(identityUser.Id, out var userGuid))
                    {
                        ModelState.AddModelError("", "Invalid user ID format.");
                        return ValidationProblem(ModelState);
                    }
                    var hasBasket = await paymentRepository.UserHasBasketAsync(userGuid);
                    if (!hasBasket)
                    {
                        await paymentRepository.CreateBasketForUserAsync(userGuid);
                    }

                    var orderBasket = await paymentRepository.GetOrderBasketByuserGuidIdAsync(userGuid);

                    if(orderBasket != null)
                    {
                        response.OrderBasketId = orderBasket.Id;
                    }

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

                    //I need to add the new user that is created into the User_Extra_Info table

                    var user_extra_info = new User_Extra_Info();
                    user_extra_info.Id = Guid.NewGuid();
                    user_extra_info.Email = request.Email;
                    user_extra_info.Address = string.Empty;
                    user_extra_info.FullName = string.Empty;
                    user_extra_info.PhoneNumber = string.Empty;
                    user_extra_info.Role = "Reader";
                    user_extra_info.RegisteredDate = DateTime.UtcNow;
                    user_extra_info.IsActive = true;
                    user_extra_info.ProfileImageUrl = string.Empty;


                    var created = await userExtraInfoRepository.AddAsync(user_extra_info);

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

        [HttpGet("me/guid")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserId()
        {
            // Get the email from claims
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return Unauthorized("Email not found in token.");

            // Find the user by email
            var identityUser = await userManager.FindByEmailAsync(email);
            if (identityUser == null)
                return Unauthorized("User not found.");

            // Convert identityUser.Id to Guid
            if (!Guid.TryParse(identityUser.Id, out var userGuid))
                return Unauthorized("User ID is not a valid GUID.");

            return Ok(new { UserId = userGuid });
        }


    }
}
