# IFome - Sistema de Gestão do Restaurante Universitário

Este projeto consiste no desenvolvimento do front-end da aplicação **IFome**, uma plataforma voltada para a modernização e eficiência do Restaurante Universitário (RU) do **IFAL**.

## Sobre o Projeto

O **IFome** nasce da necessidade de digitalizar o acesso à informação sobre as refeições oferecidas no campus. O objetivo principal é permitir que estudantes e servidores consultem o cardápio de forma prática e confirmem suas refeições, auxiliando a administração do RU na previsão de demanda e, consequentemente, na **redução do desperdício de alimentos** (estimada em uma meta de redução de 24%).

### Contexto Acadêmico

* **Instituição:** Instituto Federal de Alagoas (IFAL)
* **Disciplina:** Desenvolvimento Web 
* **Professor Orientador:** Italo Carlo Lopes Silva
* **Atividade:** Criando nossa Aplicação - Parte 1 - FrontEnd

---

## Tecnologias e Requisitos Técnicos

A aplicação foi construída seguindo critérios técnicos para garantir performance, escalabilidade e manutenibilidade:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) e componentes do [Shadcn/UI](https://ui.shadcn.com/).
* **Gerenciamento de Estado e Hooks:** Uso intensivo de `useState`, `useEffect`, `useMemo` e [TanStack Query](https://tanstack.com/query/latest) (`useQuery`) para estados assíncronos.
* **Formulários:** [React Hook Form](https://react-hook-form.com/) com validação de schema via [Zod](https://zod.dev/).
* **Feedback:** Notificações em tempo real com [React-Toastify](https://fkhadra.github.io/react-toastify/introduction/).
* **Dados:** Nesta fase, a aplicação utiliza dados **mocados** (mock data) para simular a integração com a API.
* **Responsividade:** Layout *mobile-first* adaptável para smartphones, tablets e desktops.

---

## Como Rodar o Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento localmente:

1. **Clone o repositório:**
```bash
git clone https://github.com/suellenlima2/ifome-frontend.git

```


2. **Acesse a pasta do projeto:**
```bash
cd ifome-frontend

```


3. **Instale as dependências:**
```bash
npm install
# ou
yarn install

```


4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev

```


5. **Acesse no navegador:**
Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) para visualizar a aplicação.

---

## Equipe

* [Suellen Lima]
* [Náthally Braz]
* [Adelson Santos]
* [Suzana de Souza]
* [Vitória Marques]
* [Emilly Vitória]

---

## Links Úteis

* 
* 

---

### Diretrizes de Entrega

* [x] Link do repositório no GitHub.
* [x] Deploy funcional na Vercel.
* [x] Componentização e reuso de código.
* [x] Validação de formulários e notificações de feedback.