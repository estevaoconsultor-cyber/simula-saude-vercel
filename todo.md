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

## Fase 2 - Simulador Hapvida (Concluída)
- [x] Analisar tabelas de preços da Hapvida (PDFs e Excel)
- [x] Extrair dados de preços por cidade e produto
- [x] Implementar novo fluxo: cidade → contrato → coparticipação
- [x] Criar tela de seleção de cidade
- [x] Criar tela de seleção de tipo de contrato
- [x] Criar tela de seleção de coparticipação
- [x] Implementar tabela de distribuição de vidas por faixa etária
- [x] Criar comparativo de valores entre produtos
- [x] Adicionar aba de rede de atendimento
- [x] Integrar dados de rede própria e credenciada

## Fase 3 - Integração Rede de Atendimento (Concluída)
- [x] Processar arquivos Excel da rede de atendimento (ZIP)
- [x] Extrair dados de prestadores por produto
- [x] Criar estrutura de dados da rede no app
- [x] Implementar filtros por cidade, especialidade e tipo
- [x] Vincular rede ao produto selecionado na simulação

## Fase 4 - Aba Falar com o Gestor (Em Andamento)
- [x] Criar aba "Falar com o Gestor" com contatos da equipe
- [x] Adicionar contatos: Estevão, Laís, Pablo, Jonathan, Agatha
- [x] Implementar botões de WhatsApp e E-mail direto
- [x] Processar planilha de 11.807 corretores e gestores
- [x] Criar busca "Descubra seu Gestor" por CNPJ/código/razão social
- [x] Exibir dados de contato do gestor encontrado

## Fase 5 - Modificações dos Vídeos (Pendente)
- [x] Trocar "Cidade" por "Filial de Tabela" (Filial São Paulo, etc.)
- [x] Adicionar área de comercialização abaixo de cada filial
- [x] Adicionar tag de Documentações junto com coparticipação
- [x] Separar documentação: CNPJ vs Vidas
- [x] Adicionar colunas Titular/Dependente na simulação
- [x] Mostrar detalhamento de TODOS os produtos selecionados
- [x] Criar quiz "Descubra sua Tabela" com 5+ perguntas
- [x] Criar aba "Regras" no menu com tópicos comerciais
- [x] Separar rede em Própria e Credenciada com seleção de produto
- [x] Mostrar serviços disponíveis em cada prestador

## Fase 6 - Fotos dos Executivos
- [x] Recortar foto circular do Pablo Amora
- [x] Recortar foto circular do Jonathan Leal
- [x] Recortar foto circular da Laís Martins
- [x] Recortar foto circular da Agatha Sakamoto
- [x] Recortar foto circular do Estevão Cardoso
- [x] Atualizar aba de contatos com as fotos

## Fase 7 - Correções e Melhorias
- [x] Quiz: Adicionar botão voltar para pergunta anterior (não ao início)
- [x] Distribuição de vidas: Mostrar quantidade (0,1,2,3) entre botões - e +
- [x] Distribuição de vidas: Permitir mescla de produtos por vida
- [x] Nova Simulação: Zerar orçamento sem voltar ao início

## Fase 8 - Novas Funcionalidades
- [x] Pesquisar e baixar logo Hapvida atualizada
- [x] Implementar botão editar/remover vida específica na simulação
- [x] Criar exportação PDF com logo Hapvida e gatilho emocional
- [x] PDF: Máximo 2 páginas (1 página info comercial + 1 página orçamento)
- [x] Implementar salvar simulações favoritas
- [x] Favoritos: Campo nome da empresa
- [x] Favoritos: Campo data prevista para uso da proposta
- [x] Corrigir rede própria: Nosso Médico, Smart 150, 200, 200 UP, Notre Life, Basic, Pleno
- [x] Corrigir rede credenciada: Smart 300+, Advance 600/700, Premium 900Q/900.1, Infinity
- [x] Remover Smart 200 da rede credenciada
- [x] Adicionar Advance 600, Advance 700 na rede credenciada
- [x] Adicionar Premium 900Q e Premium 900.1 (com/sem rede DO)
- [x] Adicionar Infinity na rede credenciada
- [x] Rede: Adicionar filtro por Estado
- [x] Rede: Adicionar filtro por Cidade
- [x] Rede: Adicionar filtro por Bairro

## Fase 9 - Editor de Foto do Executivo
- [x] Criar componente de editor de foto com recorte circular
- [x] Implementar seleção de foto da galeria
- [x] Implementar controle de zoom (expandir/diminuir)
- [x] Implementar controle de posição (mover foto)
- [x] Visualização em tempo real do recorte circular
- [x] Salvar foto recortada automaticamente
- [x] Adicionar botão "Editar Foto" na aba de contatos

## Fase 10 - Sistema de Contas de Executivos
- [x] Criar tabela no banco de dados para executivos
- [x] Criar aba "Conta" no menu principal
- [x] Implementar tela de cadastro (nome, WhatsApp, e-mail)
- [x] Implementar edição de perfil próprio
- [x] Implementar upload e edição de foto do perfil
- [x] Implementar busca de executivos cadastrados
- [ ] Configurar envio de e-mail ao receber novo cadastro
- [x] Integrar com aba de contatos existente

## Fase 11 - Preparação para Publicação nas Lojas
- [x] Criar Política de Privacidade em português
- [ ] Preparar configurações de build para produção
- [x] Criar descrição do app para as lojas
- [x] Criar textos promocionais curtos
- [x] Documentar processo de publicação passo a passo
- [x] Guia para Google Play Store
- [x] Guia para Apple App Store

## Fase 12 - Correções Críticas
- [x] Corrigir bug de geração de PDF do orçamento (erro em todos celulares)
- [x] Melhorar modal de adição de vidas com contador múltiplo (+/- com quantidade no meio)

## Fase 13 - Atualização da Rede de Atendimento
- [ ] Processar planilhas de rede credenciada (Advance 600/700, Smart 300/400/500, Premium 900.1, Infinity 1000.1)
- [ ] Corrigir nome Premium 900.1 Care → Sem Rede Dor
- [ ] Corrigir nome Premium 900.1 → Com Rede Dor
- [ ] Corrigir nome Infinity → Infinity 1000.1
- [ ] Adicionar Smart Ambulatorial na Rede Própria
- [ ] Adicionar Smart Prime na Rede Própria (unificar todas planilhas)
- [x] Atualizar dados de rede no app
- [ ] Criar estrutura hierárquica de contatos (5 equipes)
- [ ] Adicionar equipe Camila Foiadelli (Gerente Sênior)
- [ ] Adicionar equipe Leonardo Dias Mariano (Gerente Sênior)
- [ ] Adicionar equipe Marcelo Lima (Gerente Sênior)
- [ ] Adicionar equipe Maria Aparecida (Gerente Sênior)
- [ ] Reorganizar equipe Estevão com hierarquia

## Fase 14 - Melhorias Solicitadas
- [x] Remover fotos dos executivos (padronizar ícones)
- [x] Adicionar Manuais Comerciais em Regras (com download)
- [x] Adicionar Documentos Importantes em Regras (Carta de Responsabilidade, Contrato)
- [x] Adicionar lista de Operadoras para Aproveitamento de Carência
- [x] Adicionar informações do Plano do Vendedor

## Fase 15 - Testes e Atualizações
- [x] Executar testes automatizados do app (61 testes passando)
- [x] Processar planilhas de rede de atendimento (24.390 prestadores)
- [x] Adicionar 10 manuais comerciais para download
- [x] Atualizar dados de rede no app
- [x] Validar todas as funcionalidades

## Fase 16 - Correções Finais
- [x] Atualizar estrutura de equipes de contato (5 equipes com hierarquia)
- [x] Corrigir nomes de produtos em todas as telas
- [x] Adicionar produtos com reembolso total e parcial (Advance, Premium, Infinity)
- [x] Adicionar Premium 900.1 Care (SEM Rede Dor)
- [x] Adicionar preços para todos os produtos novos (reembolso total/parcial)

## Fase 17 - Correção de Download
- [x] Corrigir erro de download de arquivos na aba de Regras
- [x] Fazer upload de todos os documentos para CDN
- [x] Implementar download direto via URLs públicas

## Fase 18 - Atualizações Fevereiro 2026
- [x] Atualizar data de validade para 01/02/2026
- [x] Atualizar comentário de preços para Fevereiro 2026
- [ ] Corrigir ícones da tab bar no ambiente web
- [ ] Remover tarjas brancas/pretas no ambiente web

## Fase 19 - Correção de Erros Críticos (Em Andamento)
- [x] Adicionar SMART 150, 200 e 200UP na Rede Própria
- [ ] Corrigir database de gestores na aba "Pesquisar Gestor"
- [ ] Corrigir ícones MaterialIcons na tab bar web (aparecem com duas cores)
- [ ] Integrar materiais de download em "Aproveitamento de Carência"


## ESTRUTURA IMUTÁVEL - REDE DE ATENDIMENTO (CONGELADA)
**Arquivo: /data/network-structure.ts**
**Status: ✅ CONGELADO - NÃO PODE MUDAR**

### REDE PRÓPRIA (9 produtos fixos):
1. Nosso Médico
2. Smart Ambulatorial
3. Smart Prime
4. Smart 150
5. Smart 200
6. Smart 200 UP
7. NotreLife
8. Basic Referência
9. Pleno

### REDE CREDENCIADA (10 produtos fixos):
1. Smart 300
2. Smart 400 Apartamento
3. Smart 400 Enfermaria
4. Smart 500 Apartamento
5. Smart 500 Enfermaria
6. Advance 600
7. Advance 700
8. Premium 900.1 (COM Rede Dor)
9. Premium 900.1 Care (SEM Rede Dor)
10. Infinity 1000.1


## SINCRONIZAÇÃO APP/WEB (REQUISITO CRÍTICO)
**Status: EM IMPLEMENTAÇÃO**

Todas as correções e atualizações devem ser refletidas SIMULTANEAMENTE em:
- ✅ App Mobile (Expo - iOS/Android)
- ✅ Web (www.simulasaude.app.br)

### Arquivos de Sincronização Centralizada:
- [ ] Criar arquivo de configuração centralizado para dados compartilhados
- [ ] Implementar sistema de cache sincronizado
- [ ] Configurar build automático para web após cada mudança
- [ ] Adicionar versionamento de dados para rastreamento


## DEPLOY AUTOMÁTICO (CRÍTICO)
**Status: PENDENTE**

Configurar deploy automático para que:
- [ ] Toda atualização no app seja automaticamente publicada no web
- [ ] Não seja necessário clicar em "Publicar" manualmente
- [ ] Sincronização em tempo real entre app e web
- [ ] Histórico de versões mantido automaticamente


## BUILD ANDROID E WEB (CRÍTICO)
- [ ] Fazer build Android com todas as atualizações
- [ ] Fazer build web com todas as atualizações
- [ ] Publicar ambas as versões
- [ ] Validar que as mudanças aparecem em ambas
