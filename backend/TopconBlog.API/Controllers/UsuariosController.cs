using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TopconBlog.Application.DTOs;
using TopconBlog.Application.Interfaces;

namespace TopconBlog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioServico _usuarioServico;
        
        public UsuariosController(IUsuarioServico usuarioServico)
        {
            _usuarioServico = usuarioServico;
        }
        
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var usuarios = await _usuarioServico.ObterTodosAsync();
            return Ok(usuarios);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var usuario = await _usuarioServico.ObterPorIdAsync(id);
            
            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado" });
            
            return Ok(usuario);
        }
        
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarUsuarioDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var usuario = await _usuarioServico.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = usuario.Id }, usuario);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarUsuarioDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var usuario = await _usuarioServico.AtualizarAsync(id, dto);
            
            if (usuario == null)
                return NotFound(new { mensagem = "Usuário não encontrado" });
            
            return Ok(usuario);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remover(int id)
        {
            var removido = await _usuarioServico.RemoverAsync(id);
            
            if (!removido)
                return NotFound(new { mensagem = "Usuário não encontrado" });
            
            return NoContent();
        }
        
        [HttpGet("grupos")]
        public async Task<IActionResult> ListarGrupos()
        {
            var grupos = await _usuarioServico.ObterGruposAsync();
            return Ok(grupos);
        }
    }
}
