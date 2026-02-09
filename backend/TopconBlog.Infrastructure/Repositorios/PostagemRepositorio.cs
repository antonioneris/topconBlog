
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
        
        public async Task<(IEnumerable<Postagem> Postagens, int Total)> ObterPaginadoAsync(int pagina, int tamanhoPagina, string? termo = null, int? autorId = null)
        {
            var query = _dbSet.AsQueryable();

            if (autorId.HasValue)
            {
                query = query.Where(p => p.AutorId == autorId.Value);
            }

            if (!string.IsNullOrWhiteSpace(termo))
            {
                var termoLower = termo.ToLower();
                query = query.Where(p => p.Titulo.ToLower().Contains(termoLower) || 
                                         p.Conteudo.ToLower().Contains(termoLower));
            }

            var total = await query.CountAsync();
            
            var postagens = await query
                .Include(p => p.Autor)
                .OrderByDescending(p => p.DataCriacao)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();
            
            return (postagens, total);
        }
    }
}
