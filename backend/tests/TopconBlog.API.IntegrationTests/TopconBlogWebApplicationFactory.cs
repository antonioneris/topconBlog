
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting; // For Environments
using TopconBlog.Infrastructure.Dados;

namespace TopconBlog.API.IntegrationTests
{
    public class TopconBlogWebApplicationFactory : WebApplicationFactory<Program>
    {
        public TopconBlogWebApplicationFactory()
        {
            Environment.SetEnvironmentVariable("TEST_MODE", "true");
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {

                services.AddDbContext<BlogDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });
            });
        }
    }
}
