# currency-converter-frontend

## Descrição

Este é o frontend da aplicação de conversão de moedas desenvolvida como teste técnico para o **Grupo Save**. A interface permite que o usuário selecione múltiplas moedas, insira um valor e visualize os resultados em tempo real, com gráficos e histórico.

Além das funcionalidades solicitadas, foram implements **melhorias extras** como:

- Conversão entre múltiplas moedas (até 5 simultâneas)
- Validação de entrada
- Exibição da taxa de câmbio
- Gráficos de variação cambial
- Histórico das últimas conversões
- Modo escuro
- Totalmente responsivo
- Integração com backend autenticado

---

## Tecnologias Utilizadas

- **React.js** (com Vite)
- **Axios**
- **CSS puro** (modo claro/escuro)
- **Chart.js** (gráficos)
- **localStorage** (histórico)

---

## Instalação e execução local

Clone o repositório:

```bash
git clone https://github.com/seu-user/currency-converter-frontend.git
cd currency-converter-frontend
```

## Instale as depêndencias

```bash
npm install
```

## Configure as variáveis de ambiente

```bash
VITE_API_URL=https://currency-converter-api-ppzs.onrender.com/currency-converter # Este valor deve ser fixo, uma vez que é o link de para a aplicação do back
VITE_API_KEY=
```

## Rode a aplicação

```bash
npm run dev
```

## Deploy

[Frontend Vercel](https://currency-converter-api-front.vercel.app)

### Backend

[Repositório separado](https://github.com/ViniciusSchvepper/currency-converter-api)
[Deploy Render](https://currency-converter-api-ppzs.onrender.com)
