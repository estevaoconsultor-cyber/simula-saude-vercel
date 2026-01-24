# Design do Simulador de Planos de Saúde

## Visão Geral

Aplicativo móvel para simular valores de planos de saúde com base em critérios como idade, tipo de plano e cobertura. O app segue as diretrizes do Apple Human Interface Guidelines (HIG) para proporcionar uma experiência nativa iOS.

---

## Screen List

### 1. Home (Tela Principal)
Tela inicial com acesso rápido ao simulador e resumo informativo.

### 2. Simulador
Tela principal onde o usuário seleciona os critérios para simulação:
- Faixa etária
- Tipo de plano (Individual, Familiar, Empresarial)
- Tipo de cobertura (Ambulatorial, Hospitalar, Completo)
- Coparticipação (Sim/Não)
- Acomodação (Enfermaria/Apartamento)

### 3. Resultados
Exibe a tabela de valores com os planos disponíveis baseados nos critérios selecionados.

### 4. Detalhes do Plano
Mostra informações detalhadas de um plano específico selecionado.

---

## Primary Content and Functionality

### Home Screen
- **Header**: Logo do app e título "Simulador de Planos"
- **Card de Boas-vindas**: Breve explicação do app
- **Botão CTA**: "Simular Agora" - navega para o Simulador
- **Cards Informativos**: Dicas sobre escolha de planos de saúde

### Simulador Screen
- **Seção Dados Pessoais**:
  - Picker de Faixa Etária (0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+)
  - Quantidade de dependentes (contador numérico)

- **Seção Tipo de Plano**:
  - Segmented Control: Individual | Familiar | Empresarial

- **Seção Cobertura**:
  - Cards selecionáveis: Ambulatorial | Hospitalar | Completo

- **Seção Opções Adicionais**:
  - Toggle: Coparticipação (reduz valor mensal)
  - Segmented Control Acomodação: Enfermaria | Apartamento

- **Botão**: "Ver Valores" - navega para Resultados

### Resultados Screen
- **Header**: Resumo dos critérios selecionados
- **Lista de Planos**: FlatList com cards de planos
  - Nome do plano
  - Operadora
  - Valor mensal
  - Badge de destaque (Mais Popular, Melhor Custo-Benefício)
- **Filtros rápidos**: Ordenar por preço, avaliação

### Detalhes do Plano Screen
- **Header com imagem**: Logo da operadora
- **Informações principais**: Nome, operadora, valor
- **Lista de coberturas incluídas**
- **Carências**
- **Rede credenciada (resumo)**
- **Botão**: "Solicitar Contato"

---

## Key User Flows

### Flow 1: Simulação Básica
1. Usuário abre o app → Home Screen
2. Toca em "Simular Agora" → Simulador Screen
3. Seleciona faixa etária no picker
4. Escolhe tipo de plano (Individual/Familiar/Empresarial)
5. Seleciona tipo de cobertura
6. Configura opções adicionais (coparticipação, acomodação)
7. Toca em "Ver Valores" → Resultados Screen
8. Visualiza lista de planos disponíveis
9. Toca em um plano → Detalhes do Plano Screen

### Flow 2: Comparação Rápida
1. Na tela de Resultados, usuário visualiza múltiplos planos
2. Pode ordenar por preço ou avaliação
3. Compara valores lado a lado nos cards

---

## Color Choices

### Paleta Principal
- **Primary**: `#0066CC` (Azul Saúde) - Transmite confiança e profissionalismo
- **Background Light**: `#FFFFFF`
- **Background Dark**: `#1C1C1E`
- **Surface Light**: `#F2F2F7` (Cinza iOS)
- **Surface Dark**: `#2C2C2E`
- **Foreground Light**: `#000000`
- **Foreground Dark**: `#FFFFFF`
- **Muted Light**: `#8E8E93`
- **Muted Dark**: `#98989D`
- **Success**: `#34C759` (Verde iOS)
- **Warning**: `#FF9500` (Laranja iOS)
- **Error**: `#FF3B30` (Vermelho iOS)
- **Border Light**: `#E5E5EA`
- **Border Dark**: `#38383A`

### Cores Semânticas
- **Plano Básico**: `#8E8E93` (Cinza)
- **Plano Intermediário**: `#0066CC` (Azul)
- **Plano Premium**: `#AF52DE` (Roxo iOS)

---

## Typography

- **Títulos**: SF Pro Display Bold
- **Corpo**: SF Pro Text Regular
- **Valores/Preços**: SF Pro Display Semibold (destaque)

---

## Componentes UI

### Cards de Plano
- Cantos arredondados (12px)
- Sombra sutil
- Padding interno consistente (16px)
- Ícone da operadora à esquerda
- Informações à direita
- Chevron indicando navegação

### Pickers/Selectors
- Estilo nativo iOS
- Feedback visual ao selecionar
- Animações suaves

### Botões
- Primary: Fundo azul, texto branco, cantos arredondados (10px)
- Secondary: Borda azul, fundo transparente, texto azul
- Feedback haptico ao pressionar

---

## Responsividade

- Layout otimizado para iPhone (portrait 9:16)
- Suporte a diferentes tamanhos de tela
- Safe areas respeitadas
- Scroll quando necessário

---

## Acessibilidade

- Labels descritivos para VoiceOver
- Contraste adequado entre texto e fundo
- Tamanhos de toque mínimos de 44x44 pontos
- Suporte a Dynamic Type
