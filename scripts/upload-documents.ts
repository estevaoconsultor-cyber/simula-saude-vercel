// Script para fazer upload dos documentos para S3
// Execute com: npx tsx scripts/upload-documents.ts

import fs from "fs";
import path from "path";
import { storagePut } from "../server/storage";

const DOCUMENTS_DIR = path.join(__dirname, "../assets/documents");
const MANUAIS_DIR = path.join(DOCUMENTS_DIR, "manuais");

interface DocumentInfo {
  localPath: string;
  s3Key: string;
  contentType: string;
}

const DOCUMENTS: DocumentInfo[] = [
  // Documentos principais
  {
    localPath: path.join(DOCUMENTS_DIR, "carta-nomeacao.docx"),
    s3Key: "documents/carta-nomeacao.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  {
    localPath: path.join(DOCUMENTS_DIR, "contrato-prestacao-servico.docx"),
    s3Key: "documents/contrato-prestacao-servico.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  // Manuais
  {
    localPath: path.join(MANUAIS_DIR, "0.ManualAPPdoBeneficiário.pdf"),
    s3Key: "documents/manuais/0-manual-app-beneficiario.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "1.ManualdoCorretorSuperSimplesePME.pdf"),
    s3Key: "documents/manuais/1-manual-corretor-ss-pme.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "2.GuiaPráticoAppVendedor(a).pdf"),
    s3Key: "documents/manuais/2-guia-app-vendedor.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "2.1ManualPortalWebVendedor.pdf"),
    s3Key: "documents/manuais/2-1-manual-portal-web-vendedor.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "3.ManualPortaldoCliente.pdf"),
    s3Key: "documents/manuais/3-manual-portal-cliente.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "4.PortalCorretorCNPJPF.pdf"),
    s3Key: "documents/manuais/4-portal-corretor-cnpj-pf.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "5.ManualAppePortal.pdf"),
    s3Key: "documents/manuais/5-manual-app-portal.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "7.ManualdemovimentaçãoparacontratosPF.pdf"),
    s3Key: "documents/manuais/7-manual-movimentacao-pf.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "8.GuiaTrilhadeVendasHapvida.pdf"),
    s3Key: "documents/manuais/8-guia-trilha-vendas.pdf",
    contentType: "application/pdf",
  },
  {
    localPath: path.join(MANUAIS_DIR, "9.ManualdeReembolso-APPePortal.pdf"),
    s3Key: "documents/manuais/9-manual-reembolso.pdf",
    contentType: "application/pdf",
  },
];

async function uploadDocuments() {
  console.log("Iniciando upload dos documentos para S3...\n");

  const results: { name: string; url: string }[] = [];

  for (const doc of DOCUMENTS) {
    try {
      if (!fs.existsSync(doc.localPath)) {
        console.log(`⚠️ Arquivo não encontrado: ${doc.localPath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(doc.localPath);
      console.log(`📤 Enviando: ${path.basename(doc.localPath)}...`);

      const { url } = await storagePut(doc.s3Key, fileBuffer, doc.contentType);
      console.log(`✅ Enviado: ${url}\n`);

      results.push({ name: path.basename(doc.localPath), url });
    } catch (error) {
      console.error(`❌ Erro ao enviar ${doc.localPath}:`, error);
    }
  }

  console.log("\n=== URLS DOS DOCUMENTOS ===\n");
  for (const result of results) {
    console.log(`${result.name}: ${result.url}`);
  }

  // Salvar URLs em arquivo JSON
  const outputPath = path.join(__dirname, "../data/document-urls.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nURLs salvas em: ${outputPath}`);
}

uploadDocuments().catch(console.error);
