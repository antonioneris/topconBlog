
using FluentAssertions;
using Moq;
using TopconBlog.Application.DTOs;
using TopconBlog.Application.Servicos;
using TopconBlog.Domain.Entidades;
using TopconBlog.Domain.Interfaces;
using Xunit;

namespace TopconBlog.Application.Tests
{
    public class UsuarioServicoTests
    {
        private readonly Mock<IUsuarioRepositorio> _mockUsuarioRepo;
        private readonly Mock<IGrupoRepositorio> _mockGrupoRepo;
        private readonly UsuarioServico _servico;

        public UsuarioServicoTests()
        {
            _mockUsuarioRepo = new Mock<IUsuarioRepositorio>();
            _mockGrupoRepo = new Mock<IGrupoRepositorio>();
            _servico = new UsuarioServico(_mockUsuarioRepo.Object, _mockGrupoRepo.Object);
        }

        [Fact]
        public async Task CriarAsync_Deve_Criar_Usuario_Quando_Dados_Validos()
        {
            // Arrange
            var dto = new CriarUsuarioDto
            {
                Nome = "Novo Usuario",
                Email = "email@teste.com",
                Senha = "senha123",
                GrupoId = 1
            };

            _mockUsuarioRepo.Setup(r => r.EmailExisteAsync(dto.Email))
                .ReturnsAsync(false);
            
            _mockUsuarioRepo.Setup(r => r.AdicionarAsync(It.IsAny<Usuario>()))
                .ReturnsAsync((Usuario u) => u);
            
            _mockUsuarioRepo.Setup(r => r.SalvarAsync())
                .Returns(Task.CompletedTask);

            // Mocking ObterComGrupoAsync to return created user
            _mockUsuarioRepo.Setup(r => r.ObterComGrupoAsync(It.IsAny<int>()))
                .ReturnsAsync((int id) => new Usuario 
                { 
                    Id = id, 
                    Nome = dto.Nome, 
                    Email = dto.Email,
                    GrupoId = dto.GrupoId,
                    Grupo = new Grupo { Id = dto.GrupoId, Nome = "Admin" }
                });

            // Act
            var result = await _servico.CriarAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(dto.Email);
            
            _mockUsuarioRepo.Verify(r => r.AdicionarAsync(It.Is<Usuario>(u => u.Email == dto.Email)), Times.Once);
            _mockUsuarioRepo.Verify(r => r.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task CriarAsync_Deve_Lancar_Excecao_Se_Email_Ja_Existir()
        {
             // Arrange
            var dto = new CriarUsuarioDto
            {
                Nome = "Novo Usuario",
                Email = "email@existente.com",
                Senha = "senha123",
                GrupoId = 1
            };

            _mockUsuarioRepo.Setup(r => r.EmailExisteAsync(dto.Email))
                .ReturnsAsync(true);

            // Act
            Func<Task> act = async () => await _servico.CriarAsync(dto);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Já existe um usuário com este email.");
                
            _mockUsuarioRepo.Verify(r => r.AdicionarAsync(It.IsAny<Usuario>()), Times.Never);
        }
    }
}
