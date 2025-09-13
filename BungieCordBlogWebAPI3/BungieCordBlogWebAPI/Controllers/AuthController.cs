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

#region AuthorizationRecommendations
/*
Authorization Recommendations for AuthController Endpoints

Based on the defined roles:
    - Reader
    - Writer
    - Admin

Here are suggested access restrictions for typical endpoints:

1. Registration & Login Endpoints
   - register, login
   - Access: Allow anonymous (no role required).
   - Reason: New users need to register and existing users need to log in.

2. Get All Users / Get All Users With Extra Info
   - users, users-with-extra-info-and-roles
   - Access: Admin only.
   - Reason: User lists and sensitive info should be restricted to administrators.

3. Get All Roles
   - roles
   - Access: Admin only.
   - Reason: Role management is an administrative function.

4. Add Role to User / Remove All Roles from User
   - add-role-to-user, remove-all-roles-from-user
   - Access: Admin only.
   - Reason: Only admins should modify user roles.

5. Get Token Details
   - token-details
   - Access: Any authenticated user (Reader, Writer, Admin).
   - Reason: Users may need to inspect their own token.

6. Get Current UserId
   - me/guid
   - Access: Any authenticated user (Reader, Writer, Admin).
   - Reason: Users may need to retrieve their own ID.

Additional Notes:
- Writer role: If you have endpoints for creating or editing content (e.g., blog posts), restrict those to Writer and Admin.
- Reader role: If you have endpoints for viewing content, allow Reader, Writer, and Admin.
- Admin role: Should have access to all management endpoints.

Summary:
- Registration/Login: Allow anonymous
- User/Role management: Admin only
- Content creation/edit: Writer & Admin
- Content viewing: Reader, Writer, Admin
- Self-service endpoints: Any authenticated user

This structure provides a secure and clear separation of responsibilities.
*/
#endregion

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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = userManager.Users
                .Select(u => new { u.Id, u.Email, u.UserName })
                .ToList();

            return Ok(users);
        }

        [HttpGet]
        [Route("users-with-extra-info-and-roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsersWithExtraInfoandRoles()
        {
            var users = userManager.Users.ToList();
            var result = new List<UserWithExtraInfoAndRolesDto>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var extraInfo = await userExtraInfoRepository.GetByEmailAsync(user.Email);

                result.Add(new UserWithExtraInfoAndRolesDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    UserName = user.UserName,
                    Roles = roles,

                    ExtraInfoId = extraInfo?.Id,
                    FullName = extraInfo?.FullName,
                    PhoneNumber = extraInfo?.PhoneNumber,
                    Role = extraInfo?.Role,
                    Address = extraInfo?.Address,
                    RegisteredDate = extraInfo?.RegisteredDate,
                    IsActive = extraInfo?.IsActive,
                    ProfileImageUrl = extraInfo?.ProfileImageUrl
                });
            }

            return Ok(result);
        }

        [HttpPost]
        [Route("add-role-to-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRoleToUser([FromBody] AddRoleToUserRequestDto request)
        {
            // Check if role exists
            var roleExists = await roleManager.RoleExistsAsync(request.Role);
            if (!roleExists)
            {
                return Ok(new AddRoleToUserResultDto
                {
                    Success = false,
                    Message = $"Role '{request.Role}' does not exist.",
                    Email = request.Email,
                    Role = request.Role
                });
            }

            // Find user by email
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Ok(new AddRoleToUserResultDto
                {
                    Success = false,
                    Message = $"User with email '{request.Email}' not found.",
                    Email = request.Email,
                    Role = request.Role
                });
            }

            // Add role to user
            var result = await userManager.AddToRoleAsync(user, request.Role);
            if (result.Succeeded)
            {
                return Ok(new AddRoleToUserResultDto
                {
                    Success = true,
                    Message = $"Role '{request.Role}' added to user '{request.Email}'.",
                    Email = request.Email,
                    Role = request.Role
                });
            }
            else
            {
                var errorMsg = string.Join("; ", result.Errors.Select(e => e.Description));
                return Ok(new AddRoleToUserResultDto
                {
                    Success = false,
                    Message = $"Failed to add role: {errorMsg}",
                    Email = request.Email,
                    Role = request.Role
                });
            }
        }

        [HttpPost]
        [Route("remove-all-roles-from-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveAllRolesFromUser([FromBody] RemoveAllRolesFromUserRequestDto request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Ok(new RemoveAllRolesFromUserResultDto
                {
                    Success = false,
                    Email = request.Email,
                    RemovedRoles = new List<string>(),
                    Message = $"User with email '{request.Email}' not found."
                });
            }

            var currentRoles = await userManager.GetRolesAsync(user);
            if (currentRoles == null || !currentRoles.Any())
            {
                return Ok(new RemoveAllRolesFromUserResultDto
                {
                    Success = true,
                    Email = request.Email,
                    RemovedRoles = new List<string>(),
                    Message = "User has no roles to remove."
                });
            }

            var result = await userManager.RemoveFromRolesAsync(user, currentRoles);

            if (result.Succeeded)
            {
                return Ok(new RemoveAllRolesFromUserResultDto
                {
                    Success = true,
                    Email = request.Email,
                    RemovedRoles = currentRoles.ToList(),
                    Message = "All roles removed successfully."
                });
            }
            else
            {
                var errorMsg = string.Join("; ", result.Errors.Select(e => e.Description));
                return Ok(new RemoveAllRolesFromUserResultDto
                {
                    Success = false,
                    Email = request.Email,
                    RemovedRoles = new List<string>(),
                    Message = $"Failed to remove roles: {errorMsg}"
                });
            }
        }

        // GET: {apibaseurl}/api/auth/roles
        [HttpGet]
        [Route("roles")]
        [Authorize(Roles = "Admin")]
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

        // ----------------------------------------------------------------------
        // Dummy endpoints for educational purposes
        // ----------------------------------------------------------------------
        /*
        These endpoints are intentionally added as "dummy" endpoints for educational value.
        Their purpose is to demonstrate how to restrict endpoints to specific roles (Reader and Writer),
        and to show students how role-based authorization works in ASP.NET Core.
        They do not perform any real business logic, but return simple, made-up data.
        This helps illustrate how endpoints for all three roles (Admin, Reader, Writer) would be implemented.
        */

        [HttpGet]
        [Route("reader-demo")]
        [Authorize(Roles = "Reader")]
        public IActionResult ReaderDemo()
        {
            // This endpoint is accessible only to users with the Reader role.
            return Ok(new
            {
                Message = "Hello Reader! This is a demo endpoint for the Reader role.",
                ExampleData = new { ArticleTitle = "How to Use Role-Based Authorization", AccessLevel = "Read-Only" }
            });
        }

        [HttpGet]
        [Route("writer-demo")]
        [Authorize(Roles = "Writer")]
        public IActionResult WriterDemo()
        {
            // This endpoint is accessible only to users with the Writer role.
            return Ok(new
            {
                Message = "Hello Writer! This is a demo endpoint for the Writer role.",
                ExampleData = new { ArticleTitle = "How to Write Secure Endpoints", AccessLevel = "Write" }
            });
        }

    }

    /*
    Design Note: DTO Placement for Educational Purposes

    In a production-grade application, Data Transfer Objects (DTOs) are typically placed in a dedicated folder or namespace 
    (such as 'Models/DTO') to maintain a clean separation of concerns and improve code organization. This approach makes 
    DTOs easier to locate, reuse, and maintain as the project grows.

    However, for this student learning project, the 'UserWithExtraInfoAndRolesDto' is intentionally included within the 
    AuthController file. This is done for convenience and to encourage students to practice "clean coding" principles 
    as a future exercise. By keeping the DTO here, students can easily see how the DTO is used in context and later 
    refactor the code to move DTOs to a more appropriate location.

    Suggested Student Exercise:
    - Refactor the DTO into a dedicated folder (e.g., 'Models/DTO').
    - Update all references to use the new namespace.
    - Discuss the benefits of proper code organization and separation of concerns.

    Summary:
    - This placement is a conscious trade-off for educational clarity and convenience.
    - Students are encouraged to improve code structure as part of their learning journey.
    */

    public class AddRoleToUserResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }

    public class AddRoleToUserRequestDto
    {
        public string Email { get; set; }
        public string Role { get; set; }
    }



    public class UserWithExtraInfoAndRolesDto
    {
        // IdentityUser info
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public IList<string> Roles { get; set; }

        // User_Extra_Info fields
        public Guid? ExtraInfoId { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public DateTime? RegisteredDate { get; set; }
        public bool? IsActive { get; set; }
        public string ProfileImageUrl { get; set; }
    }

    public class RemoveAllRolesFromUserResultDto
    {
        public bool Success { get; set; }
        public string Email { get; set; }
        public List<string> RemovedRoles { get; set; }
        public string Message { get; set; }
    }

    public class RemoveAllRolesFromUserRequestDto
    {
        public string Email { get; set; }
    }

}
