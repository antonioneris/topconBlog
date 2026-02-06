namespace TopconBlog.Domain.Entidades
{
    public class Postagem
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Conteudo { get; set; } = string.Empty;
        public int AutorId { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
        public DateTime? DataAtualizacao { get; set; }
        public virtual Usuario? Autor { get; set; }
    }
}
