namespace BungieCordBlogWebAPI.Models.DTO
{
    public class LoginResponseDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public List<string> Roles { get; set; }
    }

    public class LogoResponseDto2 : LoginResponseDto
    {
        public Guid OrderBasketId { get; set; }
    }
}
