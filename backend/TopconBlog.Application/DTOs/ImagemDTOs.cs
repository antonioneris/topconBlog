namespace TopconBlog.Application.DTOs
{
    public class ImagemUploadResultDto
    {
        public bool Sucesso { get; set; }
        public string? Mensagem { get; set; }
        public string? Url { get; set; }
        public string? NomeArquivo { get; set; }
    }
}
