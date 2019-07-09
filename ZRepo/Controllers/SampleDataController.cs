using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ZRepo.Core;

namespace ZRepo.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private readonly GitCore gitCore;
        public SampleDataController(GitCore gitCore)
        {
            this.gitCore = gitCore;
        }

        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet("[action]")]
        public IEnumerable<Object>  WeatherForecasts()
        {
            var rng = new Random();
            var l = new List<bool>();
            return gitCore.generateTree("ZRepo");
        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }
}
