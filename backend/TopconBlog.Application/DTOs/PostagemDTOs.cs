
namespace TopconBlog.Application.DTOs
{
    public class PostagemDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Conteudo { get; set; } = string.Empty;
        public int AutorId { get; set; }
        public string? AutorNome { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
    }
    
    public class CriarPostagemDto
    {
        public string Titulo { get; set; } = string.Empty;
        public string Conteudo { get; set; } = string.Empty;
    }
    
    public class AtualizarPostagemDto
    {
        public string? Titulo { get; set; }
        public string? Conteudo { get; set; }
    }
    
    public class PostagensPaginadasDto
    {
        public IEnumerable<PostagemDto> Postagens { get; set; } = new List<PostagemDto>();
        public int Total { get; set; }
        public int Pagina { get; set; }
        public int TamanhoPagina { get; set; }
        public int TotalPaginas => (int)Math.Ceiling((double)Total / TamanhoPagina);
    }
}
