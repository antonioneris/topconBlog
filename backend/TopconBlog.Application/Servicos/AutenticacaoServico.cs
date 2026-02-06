using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TopconBlog.Application.DTOs;
using TopconBlog.Application.Interfaces;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;

namespace TopconBlog.Application.Servicos
{
    public class AutenticacaoServico : IAutenticacaoServico
    {
        private readonly IUsuarioRepositorio _usuarioRepositorio;
        private readonly IGrupoRepositorio _grupoRepositorio;
        private readonly IConfiguration _configuracao;
        
        public AutenticacaoServico(
            IUsuarioRepositorio usuarioRepositorio, 
            IGrupoRepositorio grupoRepositorio,
            IConfiguration configuracao)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _grupoRepositorio = grupoRepositorio;
            _configuracao = configuracao;
        }
        
        public async Task<RespostaAutenticacaoDto> LoginAsync(LoginDto loginDto)
        {
            var usuario = await _usuarioRepositorio.ObterPorEmailAsync(loginDto.Email);
            
            if (usuario == null)
            {
                return new RespostaAutenticacaoDto
                {
                    Sucesso = false,
                    Mensagem = "Email ou senha inválidos"
                };
            }
            
            if (!VerificarSenha(loginDto.Senha, usuario.SenhaHash))
            {
                return new RespostaAutenticacaoDto
                {
                    Sucesso = false,
                    Mensagem = "Email ou senha inválidos"
                };
            }
            
            if (!usuario.Ativo)
            {
                return new RespostaAutenticacaoDto
                {
                    Sucesso = false,
                    Mensagem = "Usuário desativado"
                };
            }
            
            var usuarioComGrupo = await _usuarioRepositorio.ObterComGrupoAsync(usuario.Id);
            
            var token = GerarTokenJwt(usuarioComGrupo!);
            
            return new RespostaAutenticacaoDto
            {
                Sucesso = true,
                Mensagem = "Login realizado com sucesso",
                Token = token,
                Usuario = MapearParaDto(usuarioComGrupo!)
            };
        }
        
        public async Task<RespostaAutenticacaoDto> RegistrarAsync(RegistroDto registroDto)
        {
            if (await _usuarioRepositorio.EmailExisteAsync(registroDto.Email))
            {
                return new RespostaAutenticacaoDto
                {
                    Sucesso = false,
                    Mensagem = "Este email já está cadastrado"
                };
            }
            
            var grupoUsuario = await _grupoRepositorio.ObterPorNomeAsync("usuario");
            if (grupoUsuario == null)
            {
                return new RespostaAutenticacaoDto
                {
                    Sucesso = false,
                    Mensagem = "Erro interno: grupo padrão não encontrado"
                };
            }
            
            var novoUsuario = new Usuario
            {
                Nome = registroDto.Nome,
                Email = registroDto.Email,
                SenhaHash = CriptografarSenha(registroDto.Senha),
                GrupoId = grupoUsuario.Id,
                DataCriacao = DateTime.UtcNow,
                Ativo = true
            };
            
            await _usuarioRepositorio.AdicionarAsync(novoUsuario);
            await _usuarioRepositorio.SalvarAsync();
            
            var usuarioComGrupo = await _usuarioRepositorio.ObterComGrupoAsync(novoUsuario.Id);
            
            var token = GerarTokenJwt(usuarioComGrupo!);
            
            return new RespostaAutenticacaoDto
            {
                Sucesso = true,
                Mensagem = "Usuário registrado com sucesso",
                Token = token,
                Usuario = MapearParaDto(usuarioComGrupo!)
            };
        }
        
        public Task<bool> ValidarTokenAsync(string token)
        {
            try
            {
                var chaveSecreta = _configuracao["JWT:SecretKey"]!;
                var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveSecreta));
                
                var tokenHandler = new JwtSecurityTokenHandler();
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = chave,
                    ValidateIssuer = true,
                    ValidIssuer = _configuracao["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuracao["JWT:Audience"],
                    ValidateLifetime = true
                }, out _);
                
                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }
        
        // ========== Métodos Privados ==========
        
        private string GerarTokenJwt(Usuario usuario)
        {
            var chaveSecreta = _configuracao["JWT:SecretKey"]!;
            var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chaveSecreta));
            var credenciais = new SigningCredentials(chave, SecurityAlgorithms.HmacSha256);
            
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Role, usuario.Grupo?.Nome ?? "usuario")
            };
            
            var token = new JwtSecurityToken(
                issuer: _configuracao["JWT:Issuer"],
                audience: _configuracao["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credenciais
            );
            
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
        private static string CriptografarSenha(string senha)
        {
            return BCrypt.Net.BCrypt.HashPassword(senha);
        }
        
        private static bool VerificarSenha(string senha, string senhaHash)
        {
            return BCrypt.Net.BCrypt.Verify(senha, senhaHash);
        }
        
        private static UsuarioDto MapearParaDto(Usuario usuario)
        {
            return new UsuarioDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                GrupoId = usuario.GrupoId,
                GrupoNome = usuario.Grupo?.Nome,
                DataCriacao = usuario.DataCriacao,
                Ativo = usuario.Ativo
            };
        }
    }
}
