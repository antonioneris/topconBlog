using TopconBlog.Application.DTOs;

namespace TopconBlog.Application.Interfaces
{
    public interface IUsuarioServico
    {
        Task<IEnumerable<UsuarioDto>> ObterTodosAsync();
        Task<UsuarioDto?> ObterPorIdAsync(int id);
        Task<UsuarioDto> CriarAsync(CriarUsuarioDto dto);
        Task<UsuarioDto?> AtualizarAsync(int id, AtualizarUsuarioDto dto);
        Task<bool> RemoverAsync(int id);
        Task<IEnumerable<GrupoDto>> ObterGruposAsync();
    }
}
