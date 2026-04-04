namespace OneToMany.Models.Domain
{

    public class Animal
    {
        public int Id { get; set; } // Unique identifier for the animal
        public string Name { get; set; } // Name of the animal
        public string Species { get; set; } // Species of the animal
        public int Age { get; set; } // Age of the animal in years
        public string Habitat { get; set; } // Habitat location within the zoo
    }
}
