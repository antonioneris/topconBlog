namespace TopconBlog.Domain.Entidades
{
    public class Grupo
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}
