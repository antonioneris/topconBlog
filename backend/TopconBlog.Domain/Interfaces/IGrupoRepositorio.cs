using TopconBlog.Domain.Entidades;

namespace TopconBlog.Domain.Interfaces
{
    public interface IGrupoRepositorio : IRepositorio<Grupo>
    {
        Task<Grupo?> ObterPorNomeAsync(string nome);
    }
}
