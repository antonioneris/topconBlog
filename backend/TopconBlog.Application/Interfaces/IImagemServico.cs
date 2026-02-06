using TopconBlog.Application.DTOs;

namespace TopconBlog.Application.Interfaces
{
    public interface IImagemServico
    {
        Task<ImagemUploadResultDto> UploadAsync(Stream arquivo, string nomeOriginal, string contentType, int usuarioId);
    }
}
