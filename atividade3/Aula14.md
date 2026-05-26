# Aula 14 - CRUD de Usuários com Node.js, Express e MongoDB Atlas

## Tecnologias utilizadas
- **Node.js** (v22)
- **Express** — framework web
- **Mongoose** — ODM para MongoDB
- **dotenv** — variáveis de ambiente
- **nodemon** — reinício automático do servidor
- **MongoDB Atlas** — banco de dados na nuvem

---

## Estrutura do projeto

```
MinhaAPI/
├── app.js
├── .env
├── package.json
├── controllers/
│   ├── usuarioController.js
│   └── calculadoraController.js
├── models/
│   └── usuario.js
└── routes/
    ├── usuarioRouter.js
    └── calculadoraRouter.js
```

---

## Configuração do banco de dados

A conexão com o MongoDB Atlas é feita via variável de ambiente no arquivo `.env`:

```env
DB_CONEXAO=mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

No `app.js`:

```js
require('dotenv').config();
mongoose.connect(process.env.DB_CONEXAO)
    .then(() => {
        app.listen(3000, () => {
            console.log('Conectado ao mongoDB');
            console.log('Servidor rodando na porta: 3000');
        });
    });
```

---

## Model — `models/usuario.js`

Define o schema do usuário no MongoDB:

```js
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario', {
    nome: String,
    email: String,
    senha: String,
    ativo: Boolean
}, "usuario");
module.exports = Usuario;
```

---

## Controller — `controllers/usuarioController.js`

Contém toda a lógica de negócio do CRUD:

| Método exportado | Descrição |
|------------------|-----------|
| `obterTodos` | Retorna todos os usuários |
| `obterPorId` | Busca usuário pelo `_id` |
| `obterPorEmail` | Busca usuário pelo e-mail |
| `inserir` | Cria um novo usuário |
| `atualizar` | Atualiza um usuário pelo `_id` |
| `deletar` | Remove um usuário pelo `_id` |

---

## Rotas — `routes/usuarioRouter.js`

Prefixo base: `/usuarios`

| Método HTTP | Rota | Ação |
|-------------|------|------|
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/email/:email` | Busca por e-mail |
| GET | `/usuarios/:id` | Busca por ID |
| POST | `/usuarios` | Cria novo usuário |
| PUT | `/usuarios/:id` | Atualiza usuário |
| DELETE | `/usuarios/:id` | Remove usuário |

> **Obs:** A rota `/email/:email` foi declarada antes de `/:id` para evitar conflito de roteamento.

---

## Respostas HTTP utilizadas

| Status | Situação |
|--------|----------|
| `200` | Sucesso (GET, PUT) |
| `201` | Criado com sucesso (POST) |
| `204` | Deletado com sucesso (DELETE) |
| `400` | Erro de validação ou ID inválido |
| `404` | Usuário não encontrado |

---

## Como rodar o projeto

```bash
npm run dev
```

O servidor inicia na porta **3000**.
