namespace Zoo.Interfaces
{
    public interface IRandomValueProvider
    {
        int GetRandomInt(int min, int max);
        string GetRandomString(string[] values);
    }
}
