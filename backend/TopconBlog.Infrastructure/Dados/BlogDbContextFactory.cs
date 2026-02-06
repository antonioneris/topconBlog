

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TopconBlog.Infrastructure.Dados
{

    public class BlogDbContextFactory : IDesignTimeDbContextFactory<BlogDbContext>
    {
        public BlogDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BlogDbContext>();
            
            // String de conexão padrão para desenvolvimento
            // Use a mesma configuração do docker-compose ou appsettings
            var connectionString = "Host=database;Port=5432;Database=topconblog;Username=topcon;Password=topcon@2024";
            
            optionsBuilder.UseNpgsql(connectionString);

            return new BlogDbContext(optionsBuilder.Options);
        }
    }
}
