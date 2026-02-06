### **Projeto: Blog**

> **Descrição**

Desenvolva um blog com algumas capacidades, incluindo 
- CRUD de postagens
- Autenticação de usuários
> 


## Funcionalidades

**`CRUD de Postagens`**

⇒ Os usuários podem criar, visualizar, atualizar e excluir postagens.
- A edição e exclusão só pode ser feita em post’s próprios.

⇒ Cada postagem deve incluir um título, conteúdo e data de criação.

**`Autenticação de usuários`**

**⇒** Implemente uma autenticação dos usuários
⇒ Os usuários devem poder se registrar, fazer login e fazer logout no blog

---

## **Tecnologias a serem utilizadas**

**`Backend`**

⇒ Utilize `.NET 9 ` para o desenvolvimento do backend

⇒ O acesso a plataforma e aos dados de postagem devem ser feitos apenas por usuários autenticados com um usuário e senha

⇒ Armazene as postagens em um banco de dados `PostgreSQL`
- Utilize Entity Framework para comunicação a base de dados 
  - usar migrations como vercionamento da base de dados
  - crie uma migration com os dados de user Dev
    user:antonio@dev.com pass:admin123 grupo:admin

- Tabelas: Postagens, Usuarios, Grupos

⇒ Use o padrao de arquitura DDD

**`Frontend`**

⇒ Utilize `React (TS)` para o desenvolvimento do frontend.

⇒ A aplicação deve ter as seguintes interfaces
- Tela de autenticação (Login) | Com opção de cadastro de novo usuário (Email / Senha)
- Tela de listagem de usuários | Apenas usuário **ADMIN** poderá manipular esses registros (CRUD)
- Tela principal com as postagens | Em ordem decrescente com campo de inserção acima
- use o bootstrap
- crie uma pagina para listar as postagens rolando para baixo tipo rede social, com a opcao de criar uma postagen no topo.

**`Controle de Versão`**

⇒ Utilize o `Git` para controle de versão do projeto.
- Com modelo de ramificação `Git Flow`

**`Read me para execução`**

⇒ Crie um *README* no repositório com as instruções para execução do projeto
- Utilize Docker para os serviços de execução (Aplicação backend, frontend, base de dados, etc)