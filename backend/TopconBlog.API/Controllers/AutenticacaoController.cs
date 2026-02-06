// =============================================================================
// Controller de Autenticação - Login e Registro
// Projeto: TopconBlog.API
// =============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TopconBlog.Application.DTOs;
using TopconBlog.Application.Interfaces;

namespace TopconBlog.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AutenticacaoController : ControllerBase
    {
        private readonly IAutenticacaoServico _autenticacaoServico;
        
        public AutenticacaoController(IAutenticacaoServico autenticacaoServico)
        {
            _autenticacaoServico = autenticacaoServico;
        }
        

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var resultado = await _autenticacaoServico.LoginAsync(loginRequest);
            
            if (!resultado.Sucesso)
                return Unauthorized(resultado);
            
            return Ok(resultado);
        }

        [HttpPost("registrar")]
        [AllowAnonymous]
        public async Task<IActionResult> Registrar([FromBody] RegistroDto novoUsuarioRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var resultado = await _autenticacaoServico.RegistrarAsync(novoUsuarioRequest);
            
            if (!resultado.Sucesso)
                return BadRequest(resultado);
            
            return Ok(resultado);
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // O logout é feito no cliente removendo o token
            return Ok(new { mensagem = "Logout realizado com sucesso" });
        }
    }
}
