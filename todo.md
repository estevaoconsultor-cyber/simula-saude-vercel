# Project TODO

## Fase 1 - Versão Inicial (Concluída)
- [x] Configurar tema de cores personalizado (azul saúde)
- [x] Criar estrutura de navegação com tabs
- [x] Desenvolver tela Home com card de boas-vindas e CTA
- [x] Criar tela Simulador com formulário de seleção
- [x] Implementar picker de faixa etária
- [x] Implementar seletor de tipo de plano
- [x] Implementar seletor de cobertura
- [x] Implementar toggles de opções adicionais
- [x] Criar tela de Resultados com lista de planos
- [x] Implementar dados mock de planos de saúde
- [x] Criar tela de Detalhes do Plano
- [x] Adicionar ícones personalizados na tab bar
- [x] Gerar logo personalizado do app
- [x] Configurar app.config.ts com branding

## Fase 2 - Integração Hapvida (Concluída)
- [x] Analisar tabelas de preços da Hapvida (PME, Super Simples, etc.)
- [x] Extrair dados de rede de atendimento (própria e credenciada)
- [x] Reestruturar fluxo: cidade → perfil → produtos
- [x] Implementar seleção de cidade como primeiro passo
- [x] Criar seleção de tipo de contrato (Super Simples, PME)
- [x] Criar seleção de coparticipação (Parcial, Total)
- [x] Desenvolver tabela de simulação com coluna de idades e quantidades
- [x] Implementar comparativo entre múltiplos produtos simultaneamente
- [x] Adicionar aba de rede de atendimento por produto
- [x] Integrar dados reais das tabelas Hapvida (São Paulo)
- [x] Criar testes unitários para validar cálculos

## Próximas Melhorias (Pendente)
- [ ] Adicionar mais cidades com tabelas específicas
- [ ] Implementar exportação de simulação em PDF
- [ ] Adicionar filtros de busca na rede de atendimento
- [ ] Implementar histórico de simulações
- [ ] Adicionar modo offline com cache de dados

## Fase 3 - Integração Rede de Atendimento Completa (Em Andamento)
- [x] Processar arquivos Excel da rede de atendimento (ZIP)
- [x] Extrair dados de prestadores por produto
- [x] Criar estrutura de dados da rede no app
- [x] Implementar filtros por cidade, especialidade e tipo
- [x] Vincular rede ao produto selecionado na simulação
