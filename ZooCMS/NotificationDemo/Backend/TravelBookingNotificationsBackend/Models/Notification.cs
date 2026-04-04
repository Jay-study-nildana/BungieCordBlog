using System;

namespace TravelBookingNotificationsBackend.Models
{
    public class Notification
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Message { get; set; }
        public string Status { get; set; } = "Unread";
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}