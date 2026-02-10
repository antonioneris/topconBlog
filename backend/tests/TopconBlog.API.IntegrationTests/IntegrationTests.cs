
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text;
using System.Text.Json;
using TopconBlog.Application.DTOs;
using Xunit;

namespace TopconBlog.API.IntegrationTests
{
    public class IntegrationTests : IClassFixture<TopconBlogWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public IntegrationTests(TopconBlogWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Get_UnknownRoute_ReturnsNotFound()
        {
            // Act
            var response = await _client.GetAsync("/api/rota-inexistente");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task Post_Login_ComCredenciaisInvalidas_DeveRetornarUnauthorized()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "email@invalido.com",
                Senha = "senha"
            };
            
            var content = new StringContent(JsonSerializer.Serialize(loginDto), Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/autenticacao/login", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
