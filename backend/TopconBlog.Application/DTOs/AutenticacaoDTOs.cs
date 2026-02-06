
namespace TopconBlog.Application.DTOs
{

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }
    
    public class RegistroDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }
    
    public class RespostaAutenticacaoDto
    {
        public bool Sucesso { get; set; }
        public string? Mensagem { get; set; }
        public string? Token { get; set; }
        public UsuarioDto? Usuario { get; set; }
    }
}
