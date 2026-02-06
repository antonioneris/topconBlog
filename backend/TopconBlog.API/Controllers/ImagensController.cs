using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TopconBlog.Application.Interfaces;

namespace TopconBlog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ImagensController : ControllerBase
    {
        private readonly IImagemServico _imagemServico;
        
        public ImagensController(IImagemServico imagemServico)
        {
            _imagemServico = imagemServico;
        }
        
        [HttpPost("upload")]
        [RequestSizeLimit(5 * 1024 * 1024)] // 5MB
        public async Task<IActionResult> Upload(IFormFile arquivo)
        {
            if (arquivo == null || arquivo.Length == 0)
            {
                return BadRequest(new { sucesso = false, mensagem = "Nenhum arquivo enviado" });
            }
            
            var usuarioId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            using var stream = arquivo.OpenReadStream();
            var resultado = await _imagemServico.UploadAsync(stream, arquivo.FileName, arquivo.ContentType, usuarioId);
            
            if (!resultado.Sucesso)
            {
                return BadRequest(resultado);
            }
            
            return Ok(resultado);
        }
    }
}
