
## 🚀 Como Executar

### Opção 1: Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker compose up -d

# Acesse:
# Frontend: http://localhost
# API:      http://localhost:8080
# Swagger:  http://localhost:8080/swagger
```

### Opção 2: Desenvolvimento Local

**Backend:**
```bash
cd backend
dotnet restore
dotnet run --project TopconBlog.API
```

**Frontend:**
```bash
cd frontend/topcon-blog-app
npm install
npm run dev
```

---

## Usuário Admin

Email: `admin@topcon.com`
Senha: `admin123`

