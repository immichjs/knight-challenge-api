# Knight Challenge API

Este repositório fornece um **MVP Template** (Produto Mínimo Viável) com um ambiente de desenvolvimento completo para iniciar projetos que envolvem uma aplicação cliente em **Nuxt.js 3** e uma API backend em **Nest.js**. Além disso, o template já vem com autenticação via **Google Auth** implementada em ambas as partes, simplificando o desenvolvimento de aplicações que exigem login social.

## Índice

- [Introdução](#introdução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Recursos](#recursos)
- [Configuração](#configuração)
- [Contribuidores](#contribuidores)

## Introdução

O **Knight Challenge API** é um desafio técnico.

## Estrutura do Projeto

A estrutura do repositório é organizada da seguinte forma:

```
src/
	/core # Deve conter todas as funcionalidades do sistema.
		/knights
			/__tests__ # Testes unitários
			/application # Serviços e casos de uso.
			/domain # Entidades, Enums, Exceptions e Interfaces
			/infrastructure # Classes de persistência como repositório
	/config # Arquivos de configurações
	/common # Arquivos compartilhados para toda aplicação
```

## Instalação

Siga as instruções abaixo para instalar e configurar o projeto localmente.

### Pré-requisitos

- Node.js (versão 20.11 ou superior)
- Pnpm

### Passos

1. Clone este repositório:

   ```bash
   git clone https://github.com/immichjs/knight-challenge-api.git
   ```

2. Instale as dependências da API

Para a API (Nest.js):

```bash
cd api
pnpm install
```

3. Execução do projeto:

```bash
// No diretório api, execute a API:
pnpm run start:dev
```

Acesse API em http://localhost:3000.

### Recursos

```
[GET] /knights?filter=heroes
[GET] /knights/:id
[POST] /knights
[PATCH] /knights/:id
[DELETE] /knights/:id
```

### Configuração

Antes de rodar o projeto, é necessário configurar o Google Auth. Siga os passos abaixo:

3. No backend (api), crie um arquivo .env com as seguintes variáveis:

```bash
MONGO_USERNAME=<seu-username-mongo>
MONGO_PASSWORD=<seu-password-mongo>
MONGO_URI=mongodb://localhost
MONGO_DATABASE=knights
```

### Contribuidores

Michel França - [Github](https://github.com/immichjs) | [Linkedin](https://linkedin.com/in/immichjs)
