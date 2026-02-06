using TopconBlog.Domain.Entidades;

namespace TopconBlog.Domain.Interfaces
{
    public interface IPostagemRepositorio : IRepositorio<Postagem>
    {
        Task<IEnumerable<Postagem>> ObterTodasOrdenadasAsync();
        Task<IEnumerable<Postagem>> ObterPorAutorAsync(int autorId);
        Task<Postagem?> ObterComAutorAsync(int id);
        Task<(IEnumerable<Postagem> Postagens, int Total)> ObterPaginadoAsync(int pagina, int tamanhoPagina);
    }
}
