using TopconBlog.Application.DTOs;
using TopconBlog.Application.Interfaces;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;

namespace TopconBlog.Application.Servicos
{
    public class UsuarioServico : IUsuarioServico
    {
        private readonly IUsuarioRepositorio _usuarioRepositorio;
        private readonly IGrupoRepositorio _grupoRepositorio;
        
        public UsuarioServico(
            IUsuarioRepositorio usuarioRepositorio,
            IGrupoRepositorio grupoRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _grupoRepositorio = grupoRepositorio;
        }
        
        public async Task<IEnumerable<UsuarioDto>> ObterTodosAsync()
        {
            var usuarios = await _usuarioRepositorio.ObterTodosAsync();
            var resultado = new List<UsuarioDto>();
            
            foreach (var usuario in usuarios)
            {
                var usuarioComGrupo = await _usuarioRepositorio.ObterComGrupoAsync(usuario.Id);
                resultado.Add(MapearParaDto(usuarioComGrupo!));
            }
            
            return resultado;
        }
        
        public async Task<UsuarioDto?> ObterPorIdAsync(int id)
        {
            var usuario = await _usuarioRepositorio.ObterComGrupoAsync(id);
            return usuario == null ? null : MapearParaDto(usuario);
        }
        
        public async Task<UsuarioDto> CriarAsync(CriarUsuarioDto dto)
        {
            if (await _usuarioRepositorio.EmailExisteAsync(dto.Email))
            {
                throw new InvalidOperationException("Já existe um usuário com este email.");
            }

            var novoUsuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                GrupoId = dto.GrupoId,
                DataCriacao = DateTime.UtcNow,
                Ativo = true
            };
            
            await _usuarioRepositorio.AdicionarAsync(novoUsuario);
            await _usuarioRepositorio.SalvarAsync();
            
            var usuarioComGrupo = await _usuarioRepositorio.ObterComGrupoAsync(novoUsuario.Id);
            return MapearParaDto(usuarioComGrupo!);
        }
        
        public async Task<UsuarioDto?> AtualizarAsync(int id, AtualizarUsuarioDto dto)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            
            if (usuario == null)
                return null;
            
            // Atualizar campos
            if (!string.IsNullOrWhiteSpace(dto.Nome))
                usuario.Nome = dto.Nome;
            
            if (!string.IsNullOrWhiteSpace(dto.Email))
                usuario.Email = dto.Email;
            
            if (!string.IsNullOrWhiteSpace(dto.Senha))
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);
            
            if (dto.GrupoId.HasValue)
                usuario.GrupoId = dto.GrupoId.Value;
            
            if (dto.Ativo.HasValue)
                usuario.Ativo = dto.Ativo.Value;
            
            await _usuarioRepositorio.AtualizarAsync(usuario);
            await _usuarioRepositorio.SalvarAsync();
            
            var usuarioAtualizado = await _usuarioRepositorio.ObterComGrupoAsync(id);
            return MapearParaDto(usuarioAtualizado!);
        }
        
        public async Task<bool> RemoverAsync(int id)
        {
            var usuario = await _usuarioRepositorio.ObterPorIdAsync(id);
            
            if (usuario == null)
                return false;
            
            await _usuarioRepositorio.RemoverAsync(usuario);
            await _usuarioRepositorio.SalvarAsync();
            
            return true;
        }
        
        public async Task<IEnumerable<GrupoDto>> ObterGruposAsync()
        {
            var grupos = await _grupoRepositorio.ObterTodosAsync();
            return grupos.Select(g => new GrupoDto
            {
                Id = g.Id,
                Nome = g.Nome,
                Descricao = g.Descricao
            });
        }
        
        // ========== Métodos Privados ==========
        
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
