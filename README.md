## Acesso demo
Eu tomei a liberdade de fazer um deplopy para ao acesso de demostracao com tudo funionando.

Acesse:

Frontend: https://blogtopcon.ddns.net/





## 🚀 Como Executar

### Opção 1: Docker Compose 

```bash
# Na raiz do projeto
docker compose up -d

# Acesse:
# Frontend: http://localhost
# API:      http://localhost/api - Consumir API
# Swagger:  http://localhost/swagger - Documentação da API
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

## Usuários

Email: `joao@topcon.com`
Senha: `user123`

Email: `cleber@topcon.com`
Senha: `user123`

Email: `luna@topcon.com`
Senha: `user123`
