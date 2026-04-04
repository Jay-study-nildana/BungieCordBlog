using BlazorHelloWorld.Models;

namespace BlazorHelloWorld.Services
{
    public class HeroService
    {
        private List<SuperHero> heroes = new List<SuperHero>();

        public List<SuperHero> GetHeroes()
        {
            return heroes;
        }

        public void AddHero(SuperHero hero)
        {
            heroes.Add(hero);
        }
    }
}
