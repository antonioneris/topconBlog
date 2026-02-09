using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TopconBlog.Application.DTOs;
using TopconBlog.Application.Interfaces;

namespace TopconBlog.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PostagensController : ControllerBase
    {
        private readonly IPostagemServico _postagemServico;
        
        public PostagensController(IPostagemServico postagemServico)
        {
            _postagemServico = postagemServico;
        }
        
        private int ObterUsuarioId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }
        
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Listar([FromQuery] int pagina = 1, [FromQuery] int tamanho = 10, [FromQuery] string? termo = null, [FromQuery] int? autorId = null)
        {
            var resultado = await _postagemServico.ObterTodasAsync(pagina, tamanho, termo, autorId);
            return Ok(resultado);
        }
        
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var postagem = await _postagemServico.ObterPorIdAsync(id);
            
            if (postagem == null)
                return NotFound(new { mensagem = "Postagem não encontrada" });
            
            return Ok(postagem);
        }
        
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarPostagemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var usuarioId = ObterUsuarioId();
            var postagem = await _postagemServico.CriarAsync(dto, usuarioId);
            
            return CreatedAtAction(nameof(ObterPorId), new { id = postagem.Id }, postagem);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] AtualizarPostagemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var usuarioId = ObterUsuarioId();
            var postagem = await _postagemServico.AtualizarAsync(id, dto, usuarioId);
            
            if (postagem == null)
                return NotFound(new { mensagem = "Postagem não encontrada ou você não tem permissão para editá-la" });
            
            return Ok(postagem);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remover(int id)
        {
            var usuarioId = ObterUsuarioId();
            var removido = await _postagemServico.RemoverAsync(id, usuarioId);
            
            if (!removido)
                return NotFound(new { mensagem = "Postagem não encontrada ou você não tem permissão para excluí-la" });
            
            return NoContent();
        }
    }
}
