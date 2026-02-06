
using Microsoft.EntityFrameworkCore;
using TopconBlog.Domain.Entidades;

namespace TopconBlog.Infrastructure.Dados
{
    
    public class BlogDbContext : DbContext
    {
        public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options){ }
        
        // Tabelas do banco de dados
        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Postagem> Postagens { get; set; } = null!;
        public DbSet<Grupo> Grupos { get; set; } = null!;
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // ===== Configuração da tabela Grupos =====
            modelBuilder.Entity<Grupo>(entity =>
            {
                entity.ToTable("grupos");
                entity.HasKey(g => g.Id);
                entity.Property(g => g.Id).HasColumnName("id");
                entity.Property(g => g.Nome).HasColumnName("nome").HasMaxLength(50).IsRequired();
                entity.Property(g => g.Descricao).HasColumnName("descricao").HasMaxLength(200);
                entity.Property(g => g.DataCriacao).HasColumnName("data_criacao");
                
                entity.HasIndex(g => g.Nome).IsUnique();
            });
            
            // ===== Configuração da tabela Usuarios =====
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuarios");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.Nome).HasColumnName("nome").HasMaxLength(100).IsRequired();
                entity.Property(u => u.Email).HasColumnName("email").HasMaxLength(100).IsRequired();
                entity.Property(u => u.SenhaHash).HasColumnName("senha_hash").HasMaxLength(200).IsRequired();
                entity.Property(u => u.GrupoId).HasColumnName("grupo_id");
                entity.Property(u => u.DataCriacao).HasColumnName("data_criacao");
                entity.Property(u => u.Ativo).HasColumnName("ativo");
                
                entity.HasIndex(u => u.Email).IsUnique();
                
                // Relacionamento com Grupo
                entity.HasOne(u => u.Grupo)
                    .WithMany(g => g.Usuarios)
                    .HasForeignKey(u => u.GrupoId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            
            // ===== Configuração da tabela Postagens =====
            modelBuilder.Entity<Postagem>(entity =>
            {
                entity.ToTable("postagens");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).HasColumnName("id");
                entity.Property(p => p.Titulo).HasColumnName("titulo").HasMaxLength(200).IsRequired();
                entity.Property(p => p.Conteudo).HasColumnName("conteudo").IsRequired();
                entity.Property(p => p.AutorId).HasColumnName("autor_id");
                entity.Property(p => p.DataCriacao).HasColumnName("data_criacao");
                entity.Property(p => p.DataAtualizacao).HasColumnName("data_atualizacao");
                
                // Relacionamento com Usuario (Autor)
                entity.HasOne(p => p.Autor)
                    .WithMany(u => u.Postagens)
                    .HasForeignKey(p => p.AutorId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
