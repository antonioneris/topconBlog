using BCrypt.Net;
using TopconBlog.Domain.Entidades;
using TopconBlog.Infrastructure.Dados;

namespace TopconBlog.Infrastructure.Dados
{
    public static class DbInitializer
    {
        public static void Initialize(BlogDbContext context)
        {
            context.Database.EnsureCreated();

            // 1. Seed Groups
            if (!context.Grupos.Any(g => g.Nome == "admin"))
            {
                context.Grupos.Add(new Grupo { Nome = "admin", Descricao = "Administradores do sistema" });
            }
            if (!context.Grupos.Any(g => g.Nome == "usuario"))
            {
                context.Grupos.Add(new Grupo { Nome = "usuario", Descricao = "Usuários padrão do sistema" });
            }
            context.SaveChanges();

            var grupoAdmin = context.Grupos.FirstOrDefault(g => g.Nome == "admin");
            var grupoUsuario = context.Grupos.FirstOrDefault(g => g.Nome == "usuario");

            // 2. Seed Users
            var usersToSeed = new List<Usuario>
            {
                new Usuario { Nome = "Usuário Admin", Email = "admin@topcon.com", SenhaHash = BCrypt.Net.BCrypt.HashPassword("admin123"), GrupoId = grupoAdmin!.Id },
                new Usuario { Nome = "Joao Carlos", Email = "joao@topcon.com", SenhaHash = BCrypt.Net.BCrypt.HashPassword("user123"), GrupoId = grupoUsuario!.Id },
                new Usuario { Nome = "Cleber Santos", Email = "cleber@topcon.com", SenhaHash = BCrypt.Net.BCrypt.HashPassword("user123"), GrupoId = grupoUsuario!.Id },
                new Usuario { Nome = "Luna Neris", Email = "luna@topcon.com", SenhaHash = BCrypt.Net.BCrypt.HashPassword("user123"), GrupoId = grupoUsuario!.Id }
            };

            foreach (var user in usersToSeed)
            {
                if (!context.Usuarios.Any(u => u.Email == user.Email))
                {
                    context.Usuarios.Add(user);
                }
            }
            context.SaveChanges();

            // 3. Seed Posts
            var joao = context.Usuarios.FirstOrDefault(u => u.Email == "joao@topcon.com");
            var cleber = context.Usuarios.FirstOrDefault(u => u.Email == "cleber@topcon.com");
            var luna = context.Usuarios.FirstOrDefault(u => u.Email == "luna@topcon.com");
            var admin = context.Usuarios.FirstOrDefault(u => u.Email == "admin@topcon.com");

            var postsToSeed = new List<Postagem>();

            if (joao != null && !context.Postagens.Any(p => p.AutorId == joao.Id))
            {
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "Os Princípios do Clean Code",
                    Conteudo = "<p>Clean Code não é apenas sobre fazer o código funcionar, é sobre torná-lo legível e sustentável.</p><p>Nomes significativos, funções pequenas e comentários apenas quando necessário são pilares fundamentais.</p>",
                    AutorId = joao.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-10)
                });
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "Arquitetura Limpa: Separando Responsabilidades",
                    Conteudo = "<p>A Clean Architecture propõe a separação do software em camadas. A camada de Domínio deve ser o coração da aplicação, independente de frameworks e UI.</p>",
                    AutorId = joao.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-5)
                });
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "Refatoração Constante",
                    Conteudo = "<p>O código nunca está pronto. A refatoração deve ser uma prática constante para manter a dívida técnica sob controle e o código sempre limpo.</p>",
                    AutorId = joao.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-1)
                });
            }

            if (cleber != null && !context.Postagens.Any(p => p.AutorId == cleber.Id))
            {
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "SOLID: O Princípio da Responsabilidade Única",
                    Conteudo = "<p>O \"S\" do SOLID nos diz que uma classe deve ter apenas um motivo para mudar. Isso reduz o acoplamento e facilita a manutenção.</p>",
                    AutorId = cleber.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-8)
                });
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "Injeção de Dependência na Prática",
                    Conteudo = "<p>Inverter o controle e injetar dependências permite criar sistemas mais modulares e testáveis. No .NET, isso é feito de forma nativa e eficiente.</p>",
                    AutorId = cleber.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-4)
                });
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "Testes Unitários e Código Limpo",
                    Conteudo = "<p>Testes não garantem apenas que o código funciona, mas também servem como documentação viva do sistema. Um código testável geralmente é um código limpo.</p>",
                    AutorId = cleber.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-2)
                });
            }

            if (luna != null && !context.Postagens.Any(p => p.AutorId == luna.Id))
            {
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "A Importância da Camada de Domínio",
                    Conteudo = "<p>Na Clean Architecture, o domínio contém as regras de negócio e não deve depender de banco de dados ou interfaces externas.</p>",
                    AutorId = luna.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-9)
                });
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "DRY: Don't Repeat Yourself",
                    Conteudo = "<p>Evitar duplicação de código é essencial. Se você copia e cola código, está criando um ponto de falha futuro quando precisar alterar a lógica.</p>",
                    AutorId = luna.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-6)
                });
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "Mantenha Simples (KISS)",
                    Conteudo = "<p>A complexidade é inimiga da qualidade. Busque sempre a solução mais simples que resolve o problema de forma eficiente e elegante.</p>",
                    AutorId = luna.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-3)
                });
            }

            if (admin != null && !context.Postagens.Any(p => p.AutorId == admin.Id))
            {
                postsToSeed.Add(new Postagem
                {
                    ImagemCapaUrl = "/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg",
                    Titulo = "Bem-vindo ao Blog Topcon!",
                    Conteudo = "<p>Este é um ambiente de aprendizado e compartilhamento de conhecimento sobre desenvolvimento de software.</p>",
                    AutorId = admin.Id,
                    DataCriacao = DateTime.UtcNow.AddDays(-30)
                });
            }

            if (postsToSeed.Any())
            {
                context.Postagens.AddRange(postsToSeed);
                context.SaveChanges();
            }
        }
    }
}
