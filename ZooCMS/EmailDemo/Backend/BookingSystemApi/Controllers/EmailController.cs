using BookingSystemApi.Services;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BookingSystemApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        //old code without try catch
        //[HttpPost("send")]
        //public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        //{
        //    if (string.IsNullOrEmpty(request.To) || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Body))
        //    {
        //        return BadRequest("Invalid email request.");
        //    }

        //    await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
        //    return Ok("Email sent successfully!");
        //}

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            if (string.IsNullOrEmpty(request.To) || string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.Body))
            {
                return BadRequest("Invalid email request.");
            }

            try
            {
                await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
                return Ok("Email sent successfully!");
            }
            catch (SmtpCommandException ex)
            {
                // Handle SMTP-specific errors
                return StatusCode(500, $"SMTP error: {ex.Message}");
            }
            catch (SmtpProtocolException ex)
            {
                // Handle protocol-specific errors
                return StatusCode(500, $"SMTP protocol error: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Handle general errors
                return StatusCode(500, $"An error occurred while sending the email: {ex.Message}");
            }
        }

    }

    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}