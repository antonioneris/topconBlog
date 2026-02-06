using Microsoft.EntityFrameworkCore;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;
using TopconBlog.Infrastructure.Dados;

namespace TopconBlog.Infrastructure.Repositorios
{
    
    public class GrupoRepositorio : Repositorio<Grupo>, IGrupoRepositorio
    {
        public GrupoRepositorio(BlogDbContext contexto) : base(contexto)
        {
        }
        
        public async Task<Grupo?> ObterPorNomeAsync(string nome)
        {
            return await _dbSet.FirstOrDefaultAsync(g => g.Nome == nome);
        }
    }
}
