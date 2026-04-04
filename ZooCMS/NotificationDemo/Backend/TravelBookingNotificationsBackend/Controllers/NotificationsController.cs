using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TravelBookingNotificationsBackend.Hubs;

[Route("api/[controller]")]
[ApiController]
public class NotificationsController : ControllerBase
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationsController(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost]
    [Route("send")]
    public async Task<IActionResult> SendNotification([FromBody] string message)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
        {
            Message = message,
            Timestamp = DateTime.UtcNow
        });
        return Ok(new { Status = "Notification Sent" });
    }
}