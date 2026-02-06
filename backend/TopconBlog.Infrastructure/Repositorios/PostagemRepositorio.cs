
using Microsoft.EntityFrameworkCore;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;
using TopconBlog.Infrastructure.Dados;

namespace TopconBlog.Infrastructure.Repositorios
{

    public class PostagemRepositorio : Repositorio<Postagem>, IPostagemRepositorio
    {
        public PostagemRepositorio(BlogDbContext contexto) : base(contexto)
        {
        }
        
        public async Task<IEnumerable<Postagem>> ObterTodasOrdenadasAsync()
        {
            return await _dbSet
                .Include(p => p.Autor)
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();
        }
        
        public async Task<IEnumerable<Postagem>> ObterPorAutorAsync(int autorId)
        {
            return await _dbSet
                .Include(p => p.Autor)
                .Where(p => p.AutorId == autorId)
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();
        }
        
        public async Task<Postagem?> ObterComAutorAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Autor)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        
        public async Task<(IEnumerable<Postagem> Postagens, int Total)> ObterPaginadoAsync(int pagina, int tamanhoPagina)
        {
            var total = await _dbSet.CountAsync();
            
            var postagens = await _dbSet
                .Include(p => p.Autor)
                .OrderByDescending(p => p.DataCriacao)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();
            
            return (postagens, total);
        }
    }
}
