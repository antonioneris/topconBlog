using TopconBlog.Application.DTOs;

namespace TopconBlog.Application.Interfaces
{
    public interface IAutenticacaoServico
    {
        Task<RespostaAutenticacaoDto> LoginAsync(LoginDto loginDto);
        Task<RespostaAutenticacaoDto> RegistrarAsync(RegistroDto registroDto);
        Task<bool> ValidarTokenAsync(string token);
    }
}
