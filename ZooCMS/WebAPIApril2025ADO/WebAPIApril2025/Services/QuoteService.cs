using System;
using System.Collections.Generic;

namespace WebAPIApril2025.Services
{
    public class QuoteService : IQuoteService
    {
        private readonly List<(string Character, string Quote)> _quotes = new()
        {
            ("Batman", "I am vengeance. I am the night. I am Batman!"),
            ("Superman", "Dreams save us. Dreams lift us up and transform us."),
            ("Wonder Woman", "If loss makes you doubt your belief in justice, then you never truly believed in justice at all."),
            ("The Flash", "Life doesn’t give us purpose. We give life purpose."),
            ("Green Lantern", "In brightest day, in blackest night, no evil shall escape my sight."),
            ("Aquaman", "The ocean is more ancient than the mountains, and freighted with the memories and the dreams of Time.")
        };

        public string GetRandomQuote()
        {
            var random = new Random();
            var randomIndex = random.Next(_quotes.Count);
            var (character, quote) = _quotes[randomIndex];
            return $"{character}: \"{quote}\"";
        }
    }
}
