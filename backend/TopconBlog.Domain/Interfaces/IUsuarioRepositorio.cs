using TopconBlog.Domain.Entidades;

namespace TopconBlog.Domain.Interfaces
{
    
    public interface IUsuarioRepositorio : IRepositorio<Usuario>
    {
        Task<Usuario?> ObterPorEmailAsync(string email);
        Task<bool> EmailExisteAsync(string email);
        Task<Usuario?> ObterComGrupoAsync(int id);
    }
}
