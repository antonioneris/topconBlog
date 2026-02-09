using TopconBlog.Application.DTOs;

namespace TopconBlog.Application.Interfaces
{
    public interface IPostagemServico
    {
        
        Task<PostagensPaginadasDto> ObterTodasAsync(int pagina = 1, int tamanhoPagina = 10, string? termo = null, int? autorId = null);
        Task<PostagemDto?> ObterPorIdAsync(int id);
        Task<PostagemDto> CriarAsync(CriarPostagemDto dto, int autorId);
        Task<PostagemDto?> AtualizarAsync(int id, AtualizarPostagemDto dto, int usuarioId);
        Task<bool> RemoverAsync(int id, int usuarioId);
        
    }
}
