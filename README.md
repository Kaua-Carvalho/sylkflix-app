# SylkFlix 🎬

<br>
<p align="center">
  <img src="public/134431788.jpg" width="100">
  <img src="public/169946056.jpg" width="100">
  <img src="public/138880659.jpg" width="100">
  <img src="public/159480669.jpg" width="100">
</p>

<p align="center">S Y L K</p>


Uma aplicação web moderna para descobrir e explorar filmes, desenvolvida com React e integração com The Movie Database (TMDB) API.

## 🚀 Demo

**Link da aplicação:** [https://sylkflix-app.vercel.app](https://sylkflix-app.vercel.app)

## 📋 Sobre o Projeto

O SylkFlix é uma aplicação web interativa que permite aos usuários:

- **Descobrir filmes** populares, em alta, mais bem avaliados e lançamentos
- **Buscar filmes** por título com resultados em tempo real
- **Filtrar por gênero** com múltiplos filtros combinados
- **Ver detalhes completos** de filmes incluindo sinopse, elenco, trailer
- **Sistema de autenticação** com registro e login
- **Perfil de usuário** personalizável
- **Interface responsiva** e moderna
- **Paginação** para navegação eficiente

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **Vite** - Build tool e desenvolvimento
- **React Router DOM** - Roteamento SPA
- **Material-UI (MUI)** - Design system e componentes
- **Axios** - Cliente HTTP para APIs
- **React Hook Form** - Gerenciamento de formulários

### Backend/Serviços
- **Firebase Authentication** - Sistema de autenticação
- **The Movie Database (TMDB) API** - Dados de filmes
- **Vercel** - Hospedagem e deploy

### Funcionalidades Implementadas

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
- [x] **Sistema de Autenticação** - Firebase Auth (login/registro)
- [x] **Rotas Protegidas** - Páginas acessíveis apenas para usuários logados
- [x] **Página de Perfil** - Gerenciamento de dados do usuário
- [x] **Interface Moderna** - Dark theme, gradientes, animações
- [x] **Responsividade** - Layout adaptativo para todos dispositivos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no [TMDB](https://www.themoviedb.org/settings/api) para obter API key
- Projeto Firebase configurado

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/sylkflix-app.git
cd sylkflix-app
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure o Firebase**
- Acesse https://console.firebase.google.com/ e crie um novo projeto
- Adicione um app web ao projeto
- Ative a autenticação por Email/Senha em Authentication → Métodos de login.
- Configure o domínio autorizado para desenvolvimento (localhost) e produção (domínio do Vercel).

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# The Movie Database API
VITE_TMDB_API_KEY=sua_chave_api_tmdb

# Configuração do Firebase
VITE_FIREBASE_API_KEY=sua_chave_api_firebase
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

## 👨‍💻 Desenvolvedores

*Luís Gustavo*
- GitHub: [@lgalvesz](https://github.com/lgalvesz)
- LinkedIn: [Luís Gustavo](https://www.linkedin.com/in/luisgustavoalves/)
- Email: luisgalvessilva@gmail.com

*Kauã Carvalho*
- Github: [@Kaua-Carvalho](https://github.com/Kaua-Carvalho)
- Linkedin: [Kauã Ribeiro Carvalho](https://www.linkedin.com/in/kauã-ribeiro-carvalho/)
- Email: kauarcarvalho@gmail.com

*Stênio Siqueira*
- Github: [@StenioSiq](https://github.com/StenioSiq)
- Linkedin: [Stênio Siqueira](https://www.linkedin.com/in/stenio-siqueira/)
- Email: steniosqr@gmail.com

*Yago Henrique*
- Github: [@YagoHT](https://github.com/YagoHT)
- Linkedin: [Yago Henrique](https://www.linkedin.com/in/yago-henrique-toledo-del-pino-vieira/)
- Email: yagoh686@gmail.com

---