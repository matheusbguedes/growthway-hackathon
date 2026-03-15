# Letiva

Frontend da plataforma **Letiva**, um SaaS criado para **professores autônomos**.

O projeto foi desenvolvido durante o **Hackathon da GrowthWay 2026**.

A plataforma resolve um problema comum de professores particulares que precisam administrar histórico de aulas, tarefas, progresso por metas, organização de agenda e acompanhamento pedagógico.

Tudo isso normalmente é feito com **planilhas, WhatsApp e memória**, o que gera desorganização e perda de alunos.  
O Letiva centraliza todo esse fluxo em um único sistema.

---

# 🚀 Começando

Estas instruções permitem executar o frontend do Letiva localmente para desenvolvimento.

---

# 📋 Pré-requisitos

Antes de iniciar, você precisa ter instalado:

```
Node.js
NPM
```

---

# 🔧 Instalação

Clone o repositório e siga os passos abaixo.

### 1. Instalar dependências

```
npm install
```

### 2. Configurar variáveis de ambiente

Renomeie o arquivo de exemplo:

```
.env.example
```

para:

```
.env.local
```

Depois preencha as variáveis necessárias com as configurações do seu ambiente, incluindo as URLs da API e as configurações do **NextAuth**.

---

### 3. Iniciar a aplicação

```
npm run dev
```

A aplicação estará disponível em:

```
[http://localhost:3000](http://localhost:3000)
```

---

# 🛠️ Construído com

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextAuth](https://next-auth.js.org/)
- [Zod](https://zod.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

# 📦 Arquitetura

O frontend foi construído utilizando **Next.js com App Router**, com foco em tipagem forte, validação consistente e componentes reutilizáveis.

---

# 👥 Time

Projeto desenvolvido durante o hackathon por:

- **João Victor Silva de Oliveira**
- **Deivid Moura Vieira**
- **Matheus Borges Guedes**
- **Tiago Tavares Contador**
