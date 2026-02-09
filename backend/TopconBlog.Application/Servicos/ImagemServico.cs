using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using TopconBlog.Application.DTOs;
using TopconBlog.Application.Interfaces;

namespace TopconBlog.Application.Servicos
{
    public class ImagemServico : IImagemServico
    {
        private readonly string _uploadsPath;
        private const long TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5MB
        private static readonly string[] EXTENSOES_PERMITIDAS = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        
        public ImagemServico(IConfiguration configuration, IHostEnvironment environment)
        {
            var uploadsPathConfig = configuration["UploadsPath"] ?? "wwwroot/uploads";
            
            // Se for caminho relativo, resolver com base no ContentRootPath
            if (!Path.IsPathRooted(uploadsPathConfig))
            {
                _uploadsPath = Path.Combine(environment.ContentRootPath, uploadsPathConfig);
            }
            else
            {
                _uploadsPath = uploadsPathConfig;
            }
            
            // Criar diretório se não existir
            if (!Directory.Exists(_uploadsPath))
            {
                Directory.CreateDirectory(_uploadsPath);
            }
        }
        
        public async Task<ImagemUploadResultDto> UploadAsync(Stream arquivo, string nomeOriginal, string contentType, int usuarioId)
        {
            // Validar tamanho
            if (arquivo.Length > TAMANHO_MAXIMO)
            {
                return new ImagemUploadResultDto
                {
                    Sucesso = false,
                    Mensagem = "Arquivo muito grande. Tamanho máximo: 5MB"
                };
            }
            
            // Validar extensão
            var extensao = Path.GetExtension(nomeOriginal).ToLowerInvariant();
            if (!EXTENSOES_PERMITIDAS.Contains(extensao))
            {
                return new ImagemUploadResultDto
                {
                    Sucesso = false,
                    Mensagem = "Tipo de arquivo não permitido. Use: jpg, jpeg, png, gif ou webp"
                };
            }
            
            // Gerar nome único
            var nomeArquivo = $"{Guid.NewGuid()}{extensao}";
            var caminhoCompleto = Path.Combine(_uploadsPath, nomeArquivo);
            
            // Salvar arquivo
            using (var fileStream = new FileStream(caminhoCompleto, FileMode.Create))
            {
                await arquivo.CopyToAsync(fileStream);
            }
            
            var url = $"/uploads/{nomeArquivo}";
            
            return new ImagemUploadResultDto
            {
                Sucesso = true,
                Mensagem = "Upload realizado com sucesso",
                Url = url,
                NomeArquivo = nomeArquivo
            };
        }
    }
}
