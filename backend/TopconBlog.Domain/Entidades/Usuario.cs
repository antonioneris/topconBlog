namespace TopconBlog.Domain.Entidades
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;
        public int GrupoId { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
        public bool Ativo { get; set; } = true;
        public virtual Grupo? Grupo { get; set; }
        public virtual ICollection<Postagem> Postagens { get; set; } = new List<Postagem>();
    }
}
