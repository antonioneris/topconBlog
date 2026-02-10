
using FluentAssertions;
using TopconBlog.Domain.Entidades;
using Xunit;

namespace TopconBlog.Domain.Tests
{
    public class UsuarioTests
    {
        [Fact]
        public void Usuario_Deve_Ter_Valores_Padrao_Corretos_Ao_Instanciar()
        {
            // Act
            var usuario = new Usuario();

            // Assert
            usuario.Ativo.Should().BeTrue("usuários devem ser ativos por padrão");
            usuario.DataCriacao.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
            usuario.Postagens.Should().NotBeNull().And.BeEmpty();
        }

        [Fact]
        public void Usuario_Deve_Permitir_Atribuicao_De_Propriedades()
        {
            // Arrange
            var usuario = new Usuario();
            var nome = "Teste";
            var email = "teste@email.com";

            // Act
            usuario.Nome = nome;
            usuario.Email = email;

            // Assert
            usuario.Nome.Should().Be(nome);
            usuario.Email.Should().Be(email);
        }
    }
}
