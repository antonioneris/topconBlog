
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TopconBlog.Domain.Interfaces;
using TopconBlog.Infrastructure.Dados;

namespace TopconBlog.Infrastructure.Repositorios
{
    public class Repositorio<T> : IRepositorio<T> where T : class
    {
        protected readonly BlogDbContext _contexto;
        protected readonly DbSet<T> _dbSet;
        
        public Repositorio(BlogDbContext contexto)
        {
            _contexto = contexto;
            _dbSet = contexto.Set<T>();
        }
        
        public virtual async Task<T?> ObterPorIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }
        
        public virtual async Task<IEnumerable<T>> ObterTodosAsync()
        {
            return await _dbSet.ToListAsync();
        }
        
        public virtual async Task<IEnumerable<T>> BuscarAsync(Expression<Func<T, bool>> predicado)
        {
            return await _dbSet.Where(predicado).ToListAsync();
        }
        
        public virtual async Task<T> AdicionarAsync(T entidade)
        {
            await _dbSet.AddAsync(entidade);
            return entidade;
        }
        
        public virtual Task AtualizarAsync(T entidade)
        {
            _dbSet.Update(entidade);
            return Task.CompletedTask;
        }
        
        public virtual Task RemoverAsync(T entidade)
        {
            _dbSet.Remove(entidade);
            return Task.CompletedTask;
        }
        
        public virtual async Task SalvarAsync()
        {
            await _contexto.SaveChangesAsync();
        }
    }
}
