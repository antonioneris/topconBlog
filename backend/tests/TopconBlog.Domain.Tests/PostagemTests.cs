
using FluentAssertions;
using TopconBlog.Domain.Entidades;
using Xunit;

namespace TopconBlog.Domain.Tests
{
    public class PostagemTests
    {
        [Fact]
        public void Postagem_Deve_Ter_DataCriacao_Definida_Ao_Instanciar()
        {
            // Act
            var postagem = new Postagem();

            // Assert
            postagem.DataCriacao.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
            postagem.DataAtualizacao.Should().BeNull();
        }

        [Fact]
        public void Postagem_Deve_Atualizar_Corretamente()
        {
            // Arrange
            var postagem = new Postagem
            {
                Titulo = "Titulo Original",
                Conteudo = "Conteudo Original"
            };

            // Act
            postagem.Titulo = "Novo Titulo";
            postagem.DataAtualizacao = DateTime.UtcNow;

            // Assert
            postagem.Titulo.Should().Be("Novo Titulo");
            postagem.DataAtualizacao.Should().NotBeNull();
        }
    }
}
