using BlazorHelloWorld.Models;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace BlazorHelloWorld.Services
{
    public class NasaApodService
    {
        private readonly HttpClient _httpClient;

        public NasaApodService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<NasaApodResponse> GetApodAsync()
        {
            return await _httpClient.GetFromJsonAsync<NasaApodResponse>("https://api.nasa.gov/planetary/apod?api_key=P1y1tyMkexVyBVLPkjKbuNHwDx1NCk0CnCnKzo5w");
        }
    }
}

