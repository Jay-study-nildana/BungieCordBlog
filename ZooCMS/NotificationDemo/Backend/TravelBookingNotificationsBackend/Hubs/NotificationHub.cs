using Microsoft.AspNetCore.SignalR;
namespace TravelBookingNotificationsBackend.Hubs
{
    using Microsoft.AspNetCore.SignalR;

    public class NotificationHub : Hub
    {
        // Broadcast a notification to all connected clients
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", new
            {
                Message = message,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}