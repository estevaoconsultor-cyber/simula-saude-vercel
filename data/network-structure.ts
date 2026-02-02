/**
 * ESTRUTURA IMUTÁVEL DA REDE DE ATENDIMENTO HAPVIDA
 * ⚠️ NÃO MODIFICAR - ESTA ESTRUTURA É FIXA E NÃO PODE MUDAR
 * 
 * Última atualização: 02/02/2026
 * Responsável: Sistema de Configuração
 */

export const NETWORK_STRUCTURE = {
  // REDE PRÓPRIA - PRODUTOS FIXOS (NÃO MUDAR)
  PROPRIA: [
    {
      id: "nosso-medico",
      name: "Nosso Médico",
      description: "Rede própria Hapvida - Clínicas regionais",
      type: "propria",
      status: "ativo"
    },
    {
      id: "smart-ambulatorial",
      name: "Smart Ambulatorial",
      description: "Rede própria ambulatorial (RJ e SP)",
      type: "propria",
      status: "ativo"
    },
    {
      id: "smart-prime",
      name: "Smart Prime",
      description: "Rede própria nacional",
      type: "propria",
      status: "ativo"
    },
    {
      id: "smart-150",
      name: "Smart 150",
      description: "Rede própria básica",
      type: "propria",
      status: "ativo"
    },
    {
      id: "smart-200",
      name: "Smart 200",
      description: "Rede própria intermediária",
      type: "propria",
      status: "ativo"
    },
    {
      id: "smart-200-up",
      name: "Smart 200 UP",
      description: "Rede própria intermediária plus",
      type: "propria",
      status: "ativo"
    },
    {
      id: "notrelife",
      name: "NotreLife",
      description: "Rede própria integrada",
      type: "propria",
      status: "ativo"
    },
    {
      id: "basic",
      name: "Basic Referência",
      description: "Rede própria básica",
      type: "propria",
      status: "ativo"
    },
    {
      id: "pleno",
      name: "Pleno",
      description: "Rede própria completa",
      type: "propria",
      status: "ativo"
    }
  ],

  // REDE CREDENCIADA - PRODUTOS FIXOS (NÃO MUDAR)
  CREDENCIADA: [
    {
      id: "smart-300",
      name: "Smart 300",
      description: "Rede credenciada regional",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "smart-400-apto",
      name: "Smart 400 Apartamento",
      description: "Rede credenciada ampliada - Apto",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "smart-400-enf",
      name: "Smart 400 Enfermaria",
      description: "Rede credenciada ampliada - Enf",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "smart-500-apto",
      name: "Smart 500 Apartamento",
      description: "Rede credenciada premium - Apto",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "smart-500-enf",
      name: "Smart 500 Enfermaria",
      description: "Rede credenciada premium - Enf",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "advance-600",
      name: "Advance 600",
      description: "Rede credenciada executiva",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "advance-700",
      name: "Advance 700",
      description: "Rede credenciada executiva plus",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "premium-900-1",
      name: "Premium 900.1",
      description: "Rede nacional premium COM Rede Dor",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "premium-900-1-care",
      name: "Premium 900.1 Care",
      description: "Rede nacional premium SEM Rede Dor",
      type: "credenciada",
      status: "ativo"
    },
    {
      id: "infinity-1000-1",
      name: "Infinity 1000.1",
      description: "Rede nacional completa - Todos os hospitais",
      type: "credenciada",
      status: "ativo"
    }
  ]
} as const;

/**
 * Função para obter produtos da rede própria (imutável)
 */
export function getOwnNetworkProducts() {
  return Object.freeze([...NETWORK_STRUCTURE.PROPRIA]);
}

/**
 * Função para obter produtos da rede credenciada (imutável)
 */
export function getCredentialsNetworkProducts() {
  return Object.freeze([...NETWORK_STRUCTURE.CREDENCIADA]);
}

/**
 * Função para validar se um produto existe na rede própria
 */
export function isOwnNetworkProduct(productId: string): boolean {
  return NETWORK_STRUCTURE.PROPRIA.some(p => p.id === productId);
}

/**
 * Função para validar se um produto existe na rede credenciada
 */
export function isCredentialsNetworkProduct(productId: string): boolean {
  return NETWORK_STRUCTURE.CREDENCIADA.some(p => p.id === productId);
}
