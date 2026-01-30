# Guia Completo de Publicação nas Lojas

Este documento contém o passo a passo detalhado para publicar o app Simula Saúde na Google Play Store e Apple App Store.

---

## Parte 1: Google Play Store (Android)

### 1.1 Criar Conta de Desenvolvedor

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Faça login com sua conta Google (ou crie uma nova)
3. Clique em **"Criar conta de desenvolvedor"**
4. Pague a taxa única de **US$ 25** (cartão de crédito internacional)
5. Preencha seus dados:
   - Nome do desenvolvedor: **Estevão Cardoso** (ou nome da empresa)
   - E-mail de contato: estevao.cardoso@hapvida.com.br
   - Telefone: (84) 99800-9598
6. Aceite os termos e aguarde a aprovação (geralmente imediata)

### 1.2 Criar o App no Console

1. No Google Play Console, clique em **"Criar app"**
2. Preencha as informações básicas:
   - **Nome do app:** Simula Saúde
   - **Idioma padrão:** Português (Brasil)
   - **Tipo de app:** App
   - **Gratuito ou pago:** Gratuito
3. Aceite as declarações e clique em **"Criar app"**

### 1.3 Configurar a Ficha da Loja

Na seção **"Presença na loja" → "Ficha principal da loja"**:

1. **Descrição curta:** (copie do arquivo descricao-lojas.md)
2. **Descrição completa:** (copie do arquivo descricao-lojas.md)
3. **Ícone do app:** Upload do arquivo `assets/images/icon.png` (512x512)
4. **Gráfico de recursos:** Criar imagem 1024x500 com logo e slogan
5. **Screenshots:** Mínimo 2, recomendado 8 (capturas de tela do app)
   - Tamanho: 1080x1920 ou 1080x2340

### 1.4 Configurar Classificação de Conteúdo

1. Vá em **"Política" → "Classificação de conteúdo"**
2. Responda o questionário (o app não tem conteúdo violento, sexual, etc.)
3. Resultado esperado: **Livre** (Everyone)

### 1.5 Configurar Política de Privacidade

1. Vá em **"Política" → "Privacidade do app"**
2. Cole a URL da política de privacidade hospedada
3. Opção: Hospedar no GitHub Pages ou site próprio

### 1.6 Gerar o Build de Produção

Execute no terminal (eu posso fazer isso para você):

```bash
cd /home/ubuntu/health-plan-simulator
npx eas build --platform android --profile production
```

Isso gera um arquivo `.aab` (Android App Bundle) para upload.

### 1.7 Fazer Upload e Publicar

1. Vá em **"Produção" → "Criar nova versão"**
2. Faça upload do arquivo `.aab`
3. Adicione notas da versão (What's New)
4. Clique em **"Revisar versão"** e depois **"Iniciar lançamento"**
5. Aguarde a revisão (1-7 dias)

---

## Parte 2: Apple App Store (iOS)

### 2.1 Criar Conta Apple Developer

1. Acesse [developer.apple.com](https://developer.apple.com)
2. Clique em **"Account"** e faça login com seu Apple ID
3. Clique em **"Join the Apple Developer Program"**
4. Escolha o tipo de conta:
   - **Individual:** Para pessoa física (US$ 99/ano)
   - **Organization:** Para empresa com DUNS Number (US$ 99/ano)
5. Pague a taxa anual de **US$ 99**
6. Aguarde a aprovação (pode levar 24-48 horas)

### 2.2 Configurar Certificados e Perfis

Esta etapa é complexa, mas o EAS Build da Expo automatiza:

```bash
npx eas credentials
```

Siga as instruções para configurar automaticamente.

### 2.3 Criar o App no App Store Connect

1. Acesse [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Clique em **"Meus Apps" → "+"** → **"Novo App"**
3. Preencha:
   - **Plataformas:** iOS
   - **Nome:** Simula Saúde
   - **Idioma principal:** Português (Brasil)
   - **ID do pacote:** Selecione o Bundle ID criado
   - **SKU:** simula-saude-001

### 2.4 Preencher Informações do App

Na aba **"Informações do App"**:

1. **Categoria:** Negócios
2. **Classificação etária:** 4+
3. **Política de Privacidade:** Cole a URL

Na aba **"Preparar para Envio"**:

1. **Screenshots:** Mínimo para cada tamanho de tela
   - iPhone 6.7" (1290x2796)
   - iPhone 6.5" (1284x2778)
   - iPhone 5.5" (1242x2208)
2. **Texto promocional:** (copie do arquivo descricao-lojas.md)
3. **Descrição:** (copie do arquivo descricao-lojas.md)
4. **Palavras-chave:** plano de saúde, hapvida, simulador, cotação
5. **URL de suporte:** Seu e-mail ou site
6. **URL de marketing:** (opcional)

### 2.5 Gerar o Build de Produção

```bash
npx eas build --platform ios --profile production
```

Isso gera um arquivo `.ipa` e faz upload automático para o App Store Connect.

### 2.6 Enviar para Revisão

1. No App Store Connect, vá em **"Preparar para Envio"**
2. Preencha as informações de revisão:
   - **Informações de contato:** Seu telefone e e-mail
   - **Notas para revisão:** (opcional) Explique o propósito do app
3. Clique em **"Enviar para Revisão"**
4. Aguarde a revisão (1-7 dias, geralmente 24-48h)

---

## Parte 3: Checklist Final

### Antes de Publicar

- [ ] Conta Google Play criada e verificada
- [ ] Conta Apple Developer criada e verificada
- [ ] Política de Privacidade hospedada em URL pública
- [ ] Ícone do app em alta resolução (1024x1024)
- [ ] Screenshots de todas as telas principais
- [ ] Descrição curta e completa revisadas
- [ ] Builds de produção gerados sem erros
- [ ] Testado em dispositivos reais (Android e iOS)

### Após Publicar

- [ ] Verificar se o app aparece nas buscas
- [ ] Testar download e instalação
- [ ] Monitorar avaliações e comentários
- [ ] Responder feedbacks dos usuários

---

## Custos Resumidos

| Item | Valor | Frequência |
|------|-------|------------|
| Google Play Developer | US$ 25 | Única vez |
| Apple Developer Program | US$ 99 | Anual |
| **Total 1º ano** | **US$ 124** | - |
| **Total anos seguintes** | **US$ 99** | Anual |

---

## Suporte

Se tiver dúvidas durante o processo, entre em contato:

- **E-mail:** estevao.cardoso@hapvida.com.br
- **WhatsApp:** (84) 99800-9598

---

*Documento criado em 30 de janeiro de 2026*
