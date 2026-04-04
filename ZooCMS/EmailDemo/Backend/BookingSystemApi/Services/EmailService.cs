using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;

namespace BookingSystemApi.Services
{
    public class EmailService
    {
        private const string SmtpServer = "smtp.gmail.com";
        private const int SmtpPort = 465; // Use 465 for SSL if required //587 for non SSL
        private const string SenderEmail = "developertestingjay69@gmail.com";
        private const string SenderPassword = "cvjn zkim oeiz eicj"; 


        //old code without try catch
        //public async Task SendEmailAsync(string recipientEmail, string subject, string body)
        //{
        //    var email = new MimeMessage();
        //    email.From.Add(MailboxAddress.Parse(SenderEmail));
        //    email.To.Add(MailboxAddress.Parse(recipientEmail));
        //    email.Subject = subject;
        //    email.Body = new TextPart("html") { Text = body };

        //    using var smtp = new SmtpClient();
        //    await smtp.ConnectAsync(SmtpServer, SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        //    await smtp.AuthenticateAsync(SenderEmail, SenderPassword);
        //    await smtp.SendAsync(email);
        //    await smtp.DisconnectAsync(true);
        //}

        public async Task SendEmailAsync(string recipientEmail, string subject, string body)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(SenderEmail));
                email.To.Add(MailboxAddress.Parse(recipientEmail));
                email.Subject = subject;
                email.Body = new TextPart("html") { Text = body };

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(SmtpServer, SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(SenderEmail, SenderPassword);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                // Log the exception (replace with your logging mechanism)
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw; // Re-throw the exception to allow higher-level handling if needed
            }
        }
    }
}