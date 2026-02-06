using System.Linq.Expressions;

namespace TopconBlog.Domain.Interfaces
{
    public interface IRepositorio<T> where T : class
    {
        Task<T?> ObterPorIdAsync(int id);
        Task<IEnumerable<T>> ObterTodosAsync();
        Task<IEnumerable<T>> BuscarAsync(Expression<Func<T, bool>> predicate);
        Task<T> AdicionarAsync(T entity);
        Task AtualizarAsync(T entity);
        Task RemoverAsync(T entity);
        Task SalvarAsync();
    }
}
