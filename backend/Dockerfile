# Imagem base para build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar arquivos de projeto e restaurar dependências
COPY ["TopconBlog.API/TopconBlog.API.csproj", "TopconBlog.API/"]
COPY ["TopconBlog.Application/TopconBlog.Application.csproj", "TopconBlog.Application/"]
COPY ["TopconBlog.Domain/TopconBlog.Domain.csproj", "TopconBlog.Domain/"]
COPY ["TopconBlog.Infrastructure/TopconBlog.Infrastructure.csproj", "TopconBlog.Infrastructure/"]
RUN dotnet restore "TopconBlog.API/TopconBlog.API.csproj"

# Copiar todo o código fonte
COPY . .

# Build da aplicação
WORKDIR "/src/TopconBlog.API"
RUN dotnet build "TopconBlog.API.csproj" -c Release -o /app/build

# Publicar a aplicação
FROM build AS publish
RUN dotnet publish "TopconBlog.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Imagem final para execução
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Development

EXPOSE 5000

ENTRYPOINT ["dotnet", "TopconBlog.API.dll"]
