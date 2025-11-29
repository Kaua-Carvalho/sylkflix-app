# SylkFlix 🎬

<br>
<p align="center">
  <img src="public/ProfilePictures/Profile1.jpg" width="100">
  <img src="public/ProfilePictures/Profile2.jpg" width="100">
  <img src="public/ProfilePictures/Profile3.jpg" width="100">
  <img src="public/ProfilePictures/Profile4.jpg" width="100">
</p>

<p align="center">S Y L K</p>

Uma aplicação web moderna para descobrir e explorar filmes, desenvolvida com React e integração com The Movie Database (TMDB) API.

## 🚀 Demo

**Link da aplicação:** [https://sylkflix-app.vercel.app](https://sylkflix-app.vercel.app)

**API Backend:** [https://backend-sylkflix-app.onrender.com](https://backend-sylkflix-app.onrender.com)

**Documentação API (Swagger):** [https://backend-sylkflix-app.onrender.com/swagger-ui.html](https://backend-sylkflix-app.onrender.com/swagger-ui.html)

---

## 📋 Sobre o Projeto

O SylkFlix é uma aplicação web interativa que permite aos usuários:

- 🎥 **Descobrir filmes** populares, em alta, mais bem avaliados e lançamentos
- 🔍 **Buscar filmes** por título com resultados em tempo real
- 🎭 **Filtrar por gênero** com múltiplos filtros combinados
- 📖 **Ver detalhes completos** de filmes incluindo sinopse, elenco, trailer
- 🔐 **Sistema de autenticação** com registro e login (JWT)
- 👤 **Perfil de usuário** personalizável com fotos de perfil
- ⭐ **Gerenciar filmes assistidos** com sistema de avaliação (1-5 estrelas)
- 📱 **Interface responsiva** e moderna com Material-UI
- 📄 **Paginação** para navegação eficiente

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **Vite** - Build tool e desenvolvimento rápido
- **React Router DOM** - Roteamento SPA
- **Material-UI (MUI)** - Design system e componentes
- **Axios** - Cliente HTTP para APIs
- **React Hook Form** - Gerenciamento de formulários

### Backend/Serviços
- **Spring Boot 3.2** - API REST (repositório separado)
- **MySQL (Aiven)** - Banco de dados em nuvem
- **JWT** - Autenticação segura
- **The Movie Database (TMDB) API** - Dados de filmes

### Hospedagem
- **Vercel** - Frontend (deploy automático)
- **Render** - Backend API (Docker)
- **Aiven** - Banco de dados MySQL

---

## ✨ Funcionalidades Implementadas

#### ✅ Requisitos Obrigatórios
- [x] **Listagem com Paginação** - Filmes populares, em alta, top rated, upcoming
- [x] **Página de Detalhes** - Rota dinâmica `/movie/:id` com informações completas
- [x] **Busca e Filtro Dinâmicos** - Busca em tempo real + filtros por gênero
- [x] **Feedback ao Usuário** - Loading states e tratamento de erros
- [x] **Componentização** - Estrutura modular com props
- [x] **Estilização Avançada** - Material-UI com tema customizado
- [x] **Roteamento** - React Router DOM com rotas protegidas
- [x] **Consumo de API** - Axios com interceptors e tratamento de erro
- [x] **Deploy** - Aplicação publicada na Vercel

#### ✅ Funcionalidades Extras
- [x] **Sistema de Autenticação** - JWT com backend próprio
- [x] **Rotas Protegidas** - Páginas acessíveis apenas para usuários logados
- [x] **Página de Perfil** - Gerenciamento de dados do usuário
- [x] **Filmes Assistidos** - Sistema completo de CRUD com avaliações
- [x] **Fotos de Perfil** - 5 avatares personalizados
- [x] **Interface Moderna** - Dark theme, gradientes, animações
- [x] **Responsividade** - Layout adaptativo para todos dispositivos
- [x] **Integração Full-Stack** - Frontend + Backend + Banco de dados

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no [TMDB](https://www.themoviedb.org/settings/api) para obter API key

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/lgalvesz/sylkflix-app
cd sylkflix-app
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# The Movie Database API
VITE_TMDB_API_KEY=sua_chave_api_tmdb

# Backend API URL (local ou produção)
VITE_API_URL=http://localhost:8080/api
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção

# Preview
npm run preview      # Preview do build de produção

# Lint
npm run lint         # Verifica código com ESLint
```

---

## 🌐 Deploy na Vercel

### Deploy Automático (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em **"Import Project"**
4. Selecione seu repositório
5. Configure as **Environment Variables**:
   ```
   VITE_TMDB_API_KEY=sua_chave_tmdb
   VITE_API_URL=https://backend-sylkflix-app.onrender.com/api
   ```
6. Clique em **"Deploy"**

A cada push no GitHub, a Vercel fará deploy automático! 🚀

---

## 📁 Estrutura do Projeto

```
sylkflix-frontend/
├── public/
│   ├── ProfilePictures/      # Avatares de perfil
│   ├── favicon.ico
│   └── placeholder-*.jpg     # Imagens placeholder
├── src/
│   ├── assets/               # Recursos estáticos
│   ├── components/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── LoadingSpinner/
│   │   └── MovieCard/
│   ├── contexts/
│   │   └── AuthContext.jsx   # Contexto de autenticação
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Profile/
│   │   ├── MovieDetails/
│   │   └── NotFound/
│   ├── services/
│   │   ├── apiService.js     # Comunicação com backend
│   │   └── tmdbApi.js        # Comunicação com TMDB
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                      # Variáveis de ambiente (não commitado)
├── .env.example              # Exemplo de variáveis
├── package.json
├── vite.config.js
└── vercel.json               # Configuração Vercel
```

---

## 🔗 Repositórios Relacionados

- **Backend (Spring Boot):** [https://github.com/lgalvesz/backend-sylkflix-app](https://github.com/lgalvesz/backend-sylkflix-app)
- **Documentação API:** [backend-sylkflix-app.onrender.com/swagger-ui.html](https://backend-sylkflix-app.onrender.com/swagger-ui.html)

---

## 💻 Desenvolvedores

**Luís Gustavo**
- GitHub: [@lgalvesz](https://github.com/lgalvesz)
- LinkedIn: [Luís Gustavo](https://www.linkedin.com/in/luisgustavoalves/)
- Email: luisgalvessilva@gmail.com

**Kauã Carvalho**
- Github: [@Kaua-Carvalho](https://github.com/Kaua-Carvalho)
- Linkedin: [Kauã Ribeiro Carvalho](https://www.linkedin.com/in/kauã-ribeiro-carvalho/)
- Email: kauarcarvalho@gmail.com

**Stênio Siqueira**
- Github: [@StenioSiq](https://github.com/StenioSiq)
- Linkedin: [Stênio Siqueira](https://www.linkedin.com/in/stenio-siqueira/)
- Email: steniosqr@gmail.com

**Yago Henrique**
- Github: [@YagoHT](https://github.com/YagoHT)
- Linkedin: [Yago Henrique](https://www.linkedin.com/in/yago-henrique-toledo-del-pino-vieira/)
- Email: yagoh686@gmail.com

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na disciplina de Frameworks Web.

---