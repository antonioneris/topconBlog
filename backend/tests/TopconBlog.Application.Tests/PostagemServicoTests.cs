
using FluentAssertions;
using Moq;
using TopconBlog.Application.DTOs;
using TopconBlog.Application.Servicos;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;
using Xunit;

namespace TopconBlog.Application.Tests
{
    public class PostagemServicoTests
    {
        private readonly Mock<IPostagemRepositorio> _mockRepositorio;
        private readonly PostagemServico _servico;

        public PostagemServicoTests()
        {
            _mockRepositorio = new Mock<IPostagemRepositorio>();
            _servico = new PostagemServico(_mockRepositorio.Object);
        }

        [Fact]
        public async Task CriarAsync_Deve_Criar_Postagem_Quando_Dados_Validos()
        {
            // Arrange
            var dto = new CriarPostagemDto
            {
                Titulo = "Titulo Teste",
                Conteudo = "Conteudo Teste",
                ImagemCapaUrl = "https://blogtopcon.ddns.net/uploads/402138c1-610a-4038-9b96-bf587621c84a.jpg"
            };
            var autorId = 1;

            _mockRepositorio.Setup(r => r.AdicionarAsync(It.IsAny<Postagem>()))
                .ReturnsAsync((Postagem p) => p);
            _mockRepositorio.Setup(r => r.SalvarAsync())
                .Returns(Task.CompletedTask);
            
            // Mocking ObterComAutorAsync to return the created post for the DTO mapping
            _mockRepositorio.Setup(r => r.ObterComAutorAsync(It.IsAny<int>()))
                .ReturnsAsync((int id) => new Postagem
                {
                    Id = id,
                    Titulo = dto.Titulo,
                    Conteudo = dto.Conteudo,
                    AutorId = autorId,
                    Autor = new Usuario { Id = autorId, Nome = "Autor Teste" },
                    DataCriacao = DateTime.UtcNow
                });

            // Act
            var result = await _servico.CriarAsync(dto, autorId);

            // Assert
            result.Should().NotBeNull();
            result.Titulo.Should().Be(dto.Titulo);
            
            _mockRepositorio.Verify(r => r.AdicionarAsync(It.Is<Postagem>(p => 
                p.Titulo == dto.Titulo && 
                p.AutorId == autorId
            )), Times.Once);
            
            _mockRepositorio.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task AtualizarAsync_Nao_Deve_Atualizar_Se_Usuario_Nao_For_Autor()
        {
            // Arrange
            var postagemId = 1;
            var usuarioId = 99; // Not the author
            var autorId = 1;
            
            var postagemExistente = new Postagem
            {
                Id = postagemId,
                AutorId = autorId
            };

            _mockRepositorio.Setup(r => r.ObterPorIdAsync(postagemId))
                .ReturnsAsync(postagemExistente);

            var dto = new AtualizarPostagemDto { Titulo = "Novo Titulo" };

            // Act
            var result = await _servico.AtualizarAsync(postagemId, dto, usuarioId);

            // Assert
            result.Should().BeNull();
            _mockRepositorio.Verify(r => r.AtualizarAsync(It.IsAny<Postagem>()), Times.Never);
            _mockRepositorio.Verify(r => r.SalvarAsync(), Times.Never);
        }

        [Fact]
        public async Task AtualizarAsync_Deve_Atualizar_Se_Usuario_For_Autor()
        {
            // Arrange
            var postagemId = 1;
            var usuarioId = 1;
            
            var postagemExistente = new Postagem
            {
                Id = postagemId,
                Titulo = "Titulo Antigo",
                AutorId = usuarioId,
                Autor = new Usuario { Id = usuarioId, Nome = "Autor" }
            };

            _mockRepositorio.Setup(r => r.ObterPorIdAsync(postagemId))
                .ReturnsAsync(postagemExistente);
                
            _mockRepositorio.Setup(r => r.ObterComAutorAsync(postagemId))
                .ReturnsAsync(postagemExistente);

            var dto = new AtualizarPostagemDto { Titulo = "Novo Titulo" };

            // Act
            var result = await _servico.AtualizarAsync(postagemId, dto, usuarioId);

            // Assert
            result.Should().NotBeNull();
            result.Titulo.Should().Be("Novo Titulo");
            
            _mockRepositorio.Verify(r => r.AtualizarAsync(It.Is<Postagem>(p => p.Titulo == "Novo Titulo")), Times.Once);
            _mockRepositorio.Verify(r => r.SalvarAsync(), Times.Once);
        }
    }
}
