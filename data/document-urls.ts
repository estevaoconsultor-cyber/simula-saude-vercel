// URLs diretas dos documentos hospedados no CDN
// Esses links são públicos e podem ser acessados diretamente

export const DOCUMENT_URLS: Record<string, { url: string; displayName: string }> = {
  // Documentos principais
  "carta-nomeacao.docx": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/carta-nomeacao.docx",
    displayName: "Carta de Nomeação",
  },
  "contrato-prestacao-servico.docx": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/contrato-prestacao-servico.docx",
    displayName: "Contrato de Prestação de Serviço",
  },
  // Manuais
  "0.ManualAPPdoBeneficiario.pdf": {
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663051957258/sPFCelGLXaHcVIup.pdf",
    displayName: "Manual APP do Beneficiário",
  },
  "1.ManualdoCorretorSuperSimplesePME.pdf": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/manuais/1-manual-corretor-ss-pme.pdf",
    displayName: "Manual do Corretor Super Simples e PME",
  },
  "2.GuiaPraticoAppVendedor.pdf": {
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663051957258/pZmwToZIAHrnaPZy.pdf",
    displayName: "Guia Prático App Vendedor",
  },
  "2.1ManualPortalWebVendedor.pdf": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/manuais/2-1-manual-portal-web-vendedor.pdf",
    displayName: "Manual Portal Web Vendedor",
  },
  "3.ManualPortaldoCliente.pdf": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/manuais/3-manual-portal-cliente.pdf",
    displayName: "Manual Portal do Cliente",
  },
  "4.PortalCorretorCNPJPF.pdf": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/manuais/4-portal-corretor-cnpj-pf.pdf",
    displayName: "Portal Corretor CNPJ/PF",
  },
  "5.ManualAppePortal.pdf": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/manuais/5-manual-app-portal.pdf",
    displayName: "Manual App e Portal",
  },
  "7.ManualMovimentacaoPF.pdf": {
    url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663051957258/YYcrNvTHgQIfVAPj.pdf",
    displayName: "Manual de Movimentação para Contratos PF",
  },
  "8.GuiaTrilhadeVendasHapvida.pdf": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/manuais/8-guia-trilha-vendas.pdf",
    displayName: "Guia Trilha de Vendas Hapvida",
  },
  "9.ManualdeReembolso.pdf": {
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663051957258/RKJzsyAwF6fqsk2m6SysrA/documents/manuais/9-manual-reembolso.pdf",
    displayName: "Manual de Reembolso - APP e Portal",
  },
};

export function getDocumentUrl(filename: string): string | null {
  const doc = DOCUMENT_URLS[filename];
  return doc ? doc.url : null;
}

export function getAllDocuments() {
  return Object.entries(DOCUMENT_URLS).map(([filename, info]) => ({
    filename,
    ...info,
  }));
}
