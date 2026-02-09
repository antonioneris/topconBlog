using TopconBlog.Application.DTOs;
using TopconBlog.Application.Interfaces;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;

namespace TopconBlog.Application.Servicos
{
    public class PostagemServico : IPostagemServico
    {
        private readonly IPostagemRepositorio _postagemRepositorio;
        
        public PostagemServico(IPostagemRepositorio postagemRepositorio)
        {
            _postagemRepositorio = postagemRepositorio;
        }
        
        public async Task<PostagensPaginadasDto> ObterTodasAsync(int pagina = 1, int tamanhoPagina = 10, string? termo = null, int? autorId = null)
        {
            var (postagens, total) = await _postagemRepositorio.ObterPaginadoAsync(pagina, tamanhoPagina, termo, autorId);
            
            return new PostagensPaginadasDto
            {
                Postagens = postagens.Select(MapearParaDto),
                Total = total,
                Pagina = pagina,
                TamanhoPagina = tamanhoPagina
            };
        }
        
        public async Task<PostagemDto?> ObterPorIdAsync(int id)
        {
            var postagem = await _postagemRepositorio.ObterComAutorAsync(id);
            return postagem == null ? null : MapearParaDto(postagem);
        }
        
        public async Task<PostagemDto> CriarAsync(CriarPostagemDto dto, int autorId)
        {
            var novaPostagem = new Postagem
            {
                Titulo = dto.Titulo,
                Conteudo = dto.Conteudo,
                ImagemCapaUrl = dto.ImagemCapaUrl,
                AutorId = autorId,
                DataCriacao = DateTime.UtcNow
            };
            
            await _postagemRepositorio.AdicionarAsync(novaPostagem);
            await _postagemRepositorio.SalvarAsync();
            
            var postagemComAutor = await _postagemRepositorio.ObterComAutorAsync(novaPostagem.Id);
            return MapearParaDto(postagemComAutor!);
        }
        
        public async Task<PostagemDto?> AtualizarAsync(int id, AtualizarPostagemDto dto, int usuarioId)
        {
            var postagem = await _postagemRepositorio.ObterPorIdAsync(id);
            
            if (postagem == null)
                return null;
            
            // Verificar se é o autor
            if (postagem.AutorId != usuarioId)
                return null;
            
            // Atualizar campos
            if (!string.IsNullOrWhiteSpace(dto.Titulo))
                postagem.Titulo = dto.Titulo;
            
            if (!string.IsNullOrWhiteSpace(dto.Conteudo))
                postagem.Conteudo = dto.Conteudo;
            
            if (dto.ImagemCapaUrl != null)
                postagem.ImagemCapaUrl = dto.ImagemCapaUrl;
            
            postagem.DataAtualizacao = DateTime.UtcNow;
            
            await _postagemRepositorio.AtualizarAsync(postagem);
            await _postagemRepositorio.SalvarAsync();
            
            var postagemAtualizada = await _postagemRepositorio.ObterComAutorAsync(id);
            return MapearParaDto(postagemAtualizada!);
        }
        
        public async Task<bool> RemoverAsync(int id, int usuarioId)
        {
            var postagem = await _postagemRepositorio.ObterPorIdAsync(id);
            
            if (postagem == null)
                return false;
            
            // Verificar se é o autor
            if (postagem.AutorId != usuarioId)
                return false;
            
            await _postagemRepositorio.RemoverAsync(postagem);
            await _postagemRepositorio.SalvarAsync();
            
            return true;
        }
        
        // ========== Métodos Privados ==========
        
        private static PostagemDto MapearParaDto(Postagem postagem)
        {
            return new PostagemDto
            {
                Id = postagem.Id,
                Titulo = postagem.Titulo,
                Conteudo = postagem.Conteudo,
                ImagemCapaUrl = postagem.ImagemCapaUrl,
                AutorId = postagem.AutorId,
                AutorNome = postagem.Autor?.Nome,
                DataCriacao = postagem.DataCriacao,
                DataAtualizacao = postagem.DataAtualizacao
            };
        }
    }
}
