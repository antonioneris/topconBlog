
using Microsoft.EntityFrameworkCore;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;
using TopconBlog.Infrastructure.Dados;

namespace TopconBlog.Infrastructure.Repositorios
{
    /// <summary>
    /// Implementação do repositório de usuários
    /// </summary>
    public class UsuarioRepositorio : Repositorio<Usuario>, IUsuarioRepositorio
    {
        public UsuarioRepositorio(BlogDbContext contexto) : base(contexto)
        {
        }
        
        public async Task<Usuario?> ObterPorEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }
        
        public async Task<bool> EmailExisteAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
        
        public async Task<Usuario?> ObterComGrupoAsync(int id)
        {
            return await _dbSet
                .Include(u => u.Grupo)
                .FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
