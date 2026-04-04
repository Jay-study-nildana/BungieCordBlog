using Microsoft.AspNetCore.Components;

namespace BlazorHelloWorld.Models
{
    public class SuperHero
    {
        [SupplyParameterFromForm(FormName = "SuperHeroForm")]
        public string Name { get; set; }
        [SupplyParameterFromForm(FormName = "SuperHeroForm")]
        public string Alias { get; set; }
        [SupplyParameterFromForm(FormName = "SuperHeroForm")]
        public string SuperPower { get; set; }
        [SupplyParameterFromForm(FormName = "SuperHeroForm")]
        public string Team { get; set; }
        [SupplyParameterFromForm(FormName = "SuperHeroForm")]
        public string Origin { get; set; }
    }
}
