// Tabelas de preços Hapvida - Atualizado Fevereiro 2026
// Dados extraídos das tabelas oficiais

export type AgeRange = 
  | "00-18" 
  | "19-23" 
  | "24-28" 
  | "29-33" 
  | "34-38" 
  | "39-43" 
  | "44-48" 
  | "49-53" 
  | "54-58" 
  | "59+";

export const AGE_RANGES: AgeRange[] = [
  "00-18",
  "19-23",
  "24-28",
  "29-33",
  "34-38",
  "39-43",
  "44-48",
  "49-53",
  "54-58",
  "59+",
];

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  "00-18": "0 a 18 anos",
  "19-23": "19 a 23 anos",
  "24-28": "24 a 28 anos",
  "29-33": "29 a 33 anos",
  "34-38": "34 a 38 anos",
  "39-43": "39 a 43 anos",
  "44-48": "44 a 48 anos",
  "49-53": "49 a 53 anos",
  "54-58": "54 a 58 anos",
  "59+": "59 anos ou mais",
};

export type City = 
  | "sao-paulo"
  | "campinas"
  | "jundiai"
  | "mogi-das-cruzes"
  | "santos"
  | "sao-bernardo"
  | "sorocaba"
  | "americana";

export interface CityInfo {
  id: City;
  name: string;
  state: string;
  commercializationArea: string[];
}

export const CITIES: CityInfo[] = [
  { 
    id: "sao-paulo", 
    name: "Filial São Paulo", 
    state: "SP",
    commercializationArea: [
      "São Paulo Capital",
      "Guarulhos",
      "Osasco",
      "Taboão da Serra",
      "Barueri",
      "Carapicuíba",
      "Itapevi",
      "Cotia",
      "Embu das Artes",
      "Diadema",
      "São Caetano do Sul",
    ]
  },
  { 
    id: "campinas", 
    name: "Filial Campinas", 
    state: "SP",
    commercializationArea: [
      "Campinas",
      "Valinhos",
      "Vinhedo",
      "Sumaré",
      "Hortolândia",
      "Indaiatuba",
      "Paulínia",
    ]
  },
  { 
    id: "jundiai", 
    name: "Filial Jundiaí", 
    state: "SP",
    commercializationArea: [
      "Jundiaí",
      "Várzea Paulista",
      "Campo Limpo Paulista",
      "Itupeva",
      "Louveira",
    ]
  },
  { 
    id: "mogi-das-cruzes", 
    name: "Filial Mogi das Cruzes", 
    state: "SP",
    commercializationArea: [
      "Mogi das Cruzes",
      "Suzano",
      "Itaquaquecetuba",
      "Poá",
      "Ferraz de Vasconcelos",
      "Arujá",
    ]
  },
  { 
    id: "santos", 
    name: "Filial Santos", 
    state: "SP",
    commercializationArea: [
      "Santos",
      "São Vicente",
      "Guarujá",
      "Praia Grande",
      "Cubatão",
    ]
  },
  { 
    id: "sao-bernardo", 
    name: "Filial São Bernardo do Campo", 
    state: "SP",
    commercializationArea: [
      "São Bernardo do Campo",
      "Santo André",
      "Mauá",
      "Ribeirão Pires",
      "Rio Grande da Serra",
    ]
  },
  { 
    id: "sorocaba", 
    name: "Filial Sorocaba", 
    state: "SP",
    commercializationArea: [
      "Sorocaba",
      "Votorantim",
      "Itu",
      "Salto",
      "Mairinque",
    ]
  },
  { 
    id: "americana", 
    name: "Filial Americana", 
    state: "SP",
    commercializationArea: [
      "Americana",
      "Santa Bárbara d'Oeste",
      "Nova Odessa",
      "Limeira",
      "Piracicaba",
    ]
  },
];

export type ContractType = 
  | "super-simples-1-vida"
  | "super-simples-2-29-mei"
  | "super-simples-2-29-demais"
  | "pme-30-99-compulsorio"
  | "pme-30-99-adesao";

export const CONTRACT_TYPES: { id: ContractType; name: string; description: string; minLives: number; maxLives: number }[] = [
  { id: "super-simples-1-vida", name: "Super Simples 1 Vida", description: "Para empresas com 1 vida", minLives: 1, maxLives: 1 },
  { id: "super-simples-2-29-mei", name: "Super Simples MEI (2-29 vidas)", description: "MEI - Microempreendedor Individual", minLives: 2, maxLives: 29 },
  { id: "super-simples-2-29-demais", name: "Super Simples Demais Empresas (2-29 vidas)", description: "Demais classificações de CNPJ", minLives: 2, maxLives: 29 },
  { id: "pme-30-99-compulsorio", name: "PME Compulsório (30-99 vidas)", description: "Contratação obrigatória", minLives: 30, maxLives: 99 },
  { id: "pme-30-99-adesao", name: "PME Adesão (30-99 vidas)", description: "Contratação não obrigatória", minLives: 30, maxLives: 99 },
];

export type CoparticipationType = "parcial" | "total";

export const COPARTICIPATION_TYPES: { id: CoparticipationType; name: string; description: string }[] = [
  { id: "parcial", name: "Coparticipação Parcial", description: "Coparticipação apenas em terapias e internações" },
  { id: "total", name: "Coparticipação Total", description: "Coparticipação em consultas, exames, terapias e internações" },
];

export type ProductCategory = "entrada" | "intermediario" | "premium";

export interface Product {
  id: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  segmentation: string;
  accommodation: "ENFERM" | "APART";
  hasReimbursement: boolean;
  reimbursementType?: "total" | "parcial";
  registroANS?: string;
}

// Produtos disponíveis
export const PRODUCTS: Product[] = [
  // Entrada - Rede Própria
  { id: "nosso-medico", name: "Nosso Médico", shortName: "N. Médico", category: "entrada", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: false },
  { id: "smart-ambulatorial", name: "Smart Ambulatorial", shortName: "Smart Amb", category: "entrada", segmentation: "AMBULATORIAL", accommodation: "ENFERM", hasReimbursement: false },
  
  // Intermediário - Smart
  { id: "smart-200", name: "Smart 200", shortName: "S200", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: false },
  { id: "smart-200-up", name: "Smart 200 UP", shortName: "S200 UP", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: false },
  { id: "smart-300", name: "Smart 300", shortName: "S300", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: false },
  { id: "smart-400-enf", name: "Smart 400 Enfermaria", shortName: "S400 E", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: false },
  { id: "smart-400-apt", name: "Smart 400 Apartamento", shortName: "S400 A", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: false },
  { id: "smart-500-enf", name: "Smart 500 Enfermaria", shortName: "S500 E", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: false },
  { id: "smart-500-apt", name: "Smart 500 Apartamento", shortName: "S500 A", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: false },
  { id: "smart-prime-enf", name: "Smart Prime Enfermaria", shortName: "Prime E", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: false },
  { id: "smart-prime-apt", name: "Smart Prime Apartamento", shortName: "Prime A", category: "intermediario", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: false },
  
  // Premium - Advance (Reembolso Total e Parcial)
  { id: "advance-600-enf-total", name: "Advance 600 Enf (Reemb. Total)", shortName: "Adv600 E T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "total" },
  { id: "advance-600-enf-parcial", name: "Advance 600 Enf (Reemb. Parcial)", shortName: "Adv600 E P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "parcial" },
  { id: "advance-600-apt-total", name: "Advance 600 Apto (Reemb. Total)", shortName: "Adv600 A T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "total" },
  { id: "advance-600-apt-parcial", name: "Advance 600 Apto (Reemb. Parcial)", shortName: "Adv600 A P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "parcial" },
  { id: "advance-700-enf-total", name: "Advance 700 Enf (Reemb. Total)", shortName: "Adv700 E T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "total" },
  { id: "advance-700-enf-parcial", name: "Advance 700 Enf (Reemb. Parcial)", shortName: "Adv700 E P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "parcial" },
  { id: "advance-700-apt-total", name: "Advance 700 Apto (Reemb. Total)", shortName: "Adv700 A T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "total" },
  { id: "advance-700-apt-parcial", name: "Advance 700 Apto (Reemb. Parcial)", shortName: "Adv700 A P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "parcial" },
  
  // Premium 900.1 (COM Rede Dor) - Reembolso Total e Parcial
  { id: "premium-900-1-enf-total", name: "Premium 900.1 Enf (Reemb. Total)", shortName: "Prem E T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "total" },
  { id: "premium-900-1-enf-parcial", name: "Premium 900.1 Enf (Reemb. Parcial)", shortName: "Prem E P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "parcial" },
  { id: "premium-900-1-apt-total", name: "Premium 900.1 Apto (Reemb. Total)", shortName: "Prem A T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "total" },
  { id: "premium-900-1-apt-parcial", name: "Premium 900.1 Apto (Reemb. Parcial)", shortName: "Prem A P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "parcial" },
  
  // Premium 900.1 Care (SEM Rede Dor) - Reembolso Total e Parcial
  { id: "premium-900-1-care-enf-total", name: "Premium 900.1 Care Enf (Reemb. Total)", shortName: "Care E T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "total" },
  { id: "premium-900-1-care-enf-parcial", name: "Premium 900.1 Care Enf (Reemb. Parcial)", shortName: "Care E P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "ENFERM", hasReimbursement: true, reimbursementType: "parcial" },
  { id: "premium-900-1-care-apt-total", name: "Premium 900.1 Care Apto (Reemb. Total)", shortName: "Care A T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "total" },
  { id: "premium-900-1-care-apt-parcial", name: "Premium 900.1 Care Apto (Reemb. Parcial)", shortName: "Care A P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "parcial" },
  
  // Infinity 1000.1 - Reembolso Total e Parcial
  { id: "infinity-1000-1-total", name: "Infinity 1000.1 (Reemb. Total)", shortName: "Inf T", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "total" },
  { id: "infinity-1000-1-parcial", name: "Infinity 1000.1 (Reemb. Parcial)", shortName: "Inf P", category: "premium", segmentation: "AMB+HOSP+OBST", accommodation: "APART", hasReimbursement: true, reimbursementType: "parcial" },
];

// Tipo para tabela de preços por faixa etária
export type PriceTable = Record<AgeRange, number>;

// Estrutura de preços: cidade -> tipo contrato -> coparticipação -> produto -> preços
export type PriceData = Record<City, Record<ContractType, Record<CoparticipationType, Record<string, PriceTable>>>>;

// Tabela de preços São Paulo - PME Adesão - Coparticipação Parcial
const SP_PME_ADESAO_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": {
    "00-18": 118.85, "19-23": 160.42, "24-28": 189.59, "29-33": 189.59,
    "34-38": 189.59, "39-43": 225.17, "44-48": 292.73, "49-53": 380.55,
    "54-58": 494.71, "59+": 713.02
  },
  "smart-ambulatorial": {
    "00-18": 114.89, "19-23": 124.83, "24-28": 147.53, "29-33": 147.53,
    "34-38": 147.53, "39-43": 175.22, "44-48": 282.98, "49-53": 299.83,
    "54-58": 384.97, "59+": 689.30
  },
  "smart-200": {
    "00-18": 128.10, "19-23": 172.91, "24-28": 204.35, "29-33": 204.35,
    "34-38": 204.35, "39-43": 242.70, "44-48": 315.52, "49-53": 410.19,
    "54-58": 533.25, "59+": 768.57
  },
  "smart-200-up": {
    "00-18": 132.06, "19-23": 178.25, "24-28": 210.66, "29-33": 210.66,
    "34-38": 210.66, "39-43": 250.19, "44-48": 325.25, "49-53": 422.83,
    "54-58": 549.70, "59+": 792.27
  },
  "smart-300": {
    "00-18": 199.25, "19-23": 268.95, "24-28": 317.85, "29-33": 332.09,
    "34-38": 343.18, "39-43": 377.50, "44-48": 490.76, "49-53": 637.99,
    "54-58": 829.39, "59+": 1195.40
  },
  "smart-500-enf": {
    "00-18": 215.09, "19-23": 290.32, "24-28": 343.10, "29-33": 358.47,
    "34-38": 370.45, "39-43": 407.49, "44-48": 529.74, "49-53": 688.66,
    "54-58": 895.26, "59+": 1290.34
  },
  "smart-500-apt": {
    "00-18": 238.74, "19-23": 322.25, "24-28": 380.84, "29-33": 397.90,
    "34-38": 411.19, "39-43": 452.31, "44-48": 588.00, "49-53": 764.40,
    "54-58": 993.72, "59+": 1432.25
  },
  "smart-prime-enf": {
    "00-18": 225.84, "19-23": 264.23, "24-28": 322.35, "29-33": 386.82,
    "34-38": 406.16, "39-43": 446.77, "44-48": 558.47, "49-53": 675.22,
    "54-58": 844.59, "59+": 1343.75
  },
  "smart-prime-apt": {
    "00-18": 250.68, "19-23": 293.29, "24-28": 357.82, "29-33": 429.39,
    "34-38": 450.86, "39-43": 495.95, "44-48": 619.94, "49-53": 749.55,
    "54-58": 937.57, "59+": 1491.68
  },
  "advance-600-enf-total": {
    "00-18": 269.89, "19-23": 315.77, "24-28": 385.24, "29-33": 462.29,
    "34-38": 485.41, "39-43": 533.94, "44-48": 667.43, "49-53": 806.97,
    "54-58": 1009.40, "59+": 1605.97
  },
  "advance-600-apt-total": {
    "00-18": 299.59, "19-23": 350.52, "24-28": 427.63, "29-33": 513.17,
    "34-38": 538.83, "39-43": 592.71, "44-48": 740.88, "49-53": 895.78,
    "54-58": 1120.47, "59+": 1782.69
  },
  "advance-700-enf-total": {
    "00-18": 356.49, "19-23": 417.09, "24-28": 508.84, "29-33": 610.62,
    "34-38": 641.17, "39-43": 705.28, "44-48": 881.60, "49-53": 1065.92,
    "54-58": 1333.28, "59+": 2121.28
  },
  "advance-700-apt-total": {
    "00-18": 395.72, "19-23": 462.99, "24-28": 564.84, "29-33": 677.81,
    "34-38": 711.71, "39-43": 782.88, "44-48": 978.62, "49-53": 1183.22,
    "54-58": 1480.01, "59+": 2354.73
  },
  "premium-900-1-apt-total": {
    "00-18": 752.61, "19-23": 880.54, "24-28": 1074.25, "29-33": 1289.12,
    "34-38": 1353.59, "39-43": 1488.93, "44-48": 1861.17, "49-53": 2250.28,
    "54-58": 2814.75, "59+": 4478.30
  },
  "infinity-1000-1-total": {
    "00-18": 1038.61, "19-23": 1215.15, "24-28": 1482.48, "29-33": 1778.99,
    "34-38": 1867.96, "39-43": 2054.75, "44-48": 2568.45, "49-53": 3105.43,
    "54-58": 3884.40, "59+": 6180.13
  },
  // Produtos com Reembolso PARCIAL
  "advance-600-enf-parcial": {
    "00-18": 299.55, "19-23": 350.47, "24-28": 427.57, "29-33": 513.09,
    "34-38": 538.75, "39-43": 592.62, "44-48": 740.78, "49-53": 895.65,
    "54-58": 1120.32, "59+": 1782.44
  },
  "advance-600-apt-parcial": {
    "00-18": 332.51, "19-23": 389.03, "24-28": 474.62, "29-33": 569.55,
    "34-38": 598.03, "39-43": 657.83, "44-48": 822.29, "49-53": 994.20,
    "54-58": 1243.59, "59+": 1978.56
  },
  "advance-700-enf-parcial": {
    "00-18": 340.88, "19-23": 398.83, "24-28": 486.56, "29-33": 583.88,
    "34-38": 613.08, "39-43": 674.39, "44-48": 842.99, "49-53": 1019.23,
    "54-58": 1274.89, "59+": 2028.37
  },
  "advance-700-apt-parcial": {
    "00-18": 378.38, "19-23": 442.70, "24-28": 540.09, "29-33": 648.12,
    "34-38": 680.53, "39-43": 748.57, "44-48": 935.72, "49-53": 1131.36,
    "54-58": 1415.14, "59+": 2251.51
  },
  "premium-900-1-enf-total": {
    "00-18": 752.61, "19-23": 880.54, "24-28": 1074.25, "29-33": 1289.12,
    "34-38": 1353.59, "39-43": 1488.93, "44-48": 1861.17, "49-53": 2250.28,
    "54-58": 2814.75, "59+": 4478.30
  },
  "premium-900-1-enf-parcial": {
    "00-18": 429.09, "19-23": 503.14, "24-28": 613.82, "29-33": 736.59,
    "34-38": 773.42, "39-43": 850.76, "44-48": 1063.45, "49-53": 1285.97,
    "54-58": 1608.52, "59+": 2559.23
  },
  "premium-900-1-apt-parcial": {
    "00-18": 456.46, "19-23": 534.10, "24-28": 651.60, "29-33": 781.93,
    "34-38": 821.03, "39-43": 903.13, "44-48": 1128.91, "49-53": 1365.14,
    "54-58": 1707.50, "59+": 2716.70
  },
  // Premium 900.1 Care (SEM Rede Dor)
  "premium-900-1-care-enf-total": {
    "00-18": 752.61, "19-23": 880.54, "24-28": 1074.25, "29-33": 1289.12,
    "34-38": 1353.59, "39-43": 1488.93, "44-48": 1861.17, "49-53": 2250.28,
    "54-58": 2814.75, "59+": 4478.30
  },
  "premium-900-1-care-apt-total": {
    "00-18": 800.77, "19-23": 936.89, "24-28": 1142.99, "29-33": 1371.61,
    "34-38": 1440.20, "39-43": 1584.21, "44-48": 1980.27, "49-53": 2394.27,
    "54-58": 2994.86, "59+": 4764.87
  },
  "premium-900-1-care-enf-parcial": {
    "00-18": 318.58, "19-23": 372.73, "24-28": 454.71, "29-33": 545.65,
    "34-38": 572.94, "39-43": 630.23, "44-48": 787.79, "49-53": 952.49,
    "54-58": 1191.41, "59+": 1895.55
  },
  "premium-900-1-care-apt-parcial": {
    "00-18": 353.63, "19-23": 413.74, "24-28": 504.76, "29-33": 605.73,
    "34-38": 636.02, "39-43": 699.62, "44-48": 874.52, "49-53": 1057.36,
    "54-58": 1322.57, "59+": 2104.33
  },
  "infinity-1000-1-parcial": {
    "00-18": 465.27, "19-23": 544.38, "24-28": 664.12, "29-33": 796.95,
    "34-38": 836.80, "39-43": 920.48, "44-48": 1150.61, "49-53": 1391.16,
    "54-58": 1740.12, "59+": 2768.55
  },
};

// Tabela de preços São Paulo - PME Adesão - Coparticipação Total
const SP_PME_ADESAO_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": {
    "00-18": 89.16, "19-23": 120.35, "24-28": 142.23, "29-33": 142.23,
    "34-38": 142.23, "39-43": 168.93, "44-48": 219.61, "49-53": 285.49,
    "54-58": 371.14, "59+": 534.92
  },
  "smart-ambulatorial": {
    "00-18": 86.19, "19-23": 93.65, "24-28": 110.68, "29-33": 110.68,
    "34-38": 110.68, "39-43": 131.45, "44-48": 212.29, "49-53": 224.93,
    "54-58": 288.80, "59+": 517.12
  },
  "smart-200": {
    "00-18": 96.10, "19-23": 129.72, "24-28": 153.30, "29-33": 153.30,
    "34-38": 153.30, "39-43": 182.08, "44-48": 236.71, "49-53": 307.72,
    "54-58": 400.04, "59+": 576.57
  },
  "smart-200-up": {
    "00-18": 99.07, "19-23": 133.72, "24-28": 158.05, "29-33": 158.05,
    "34-38": 158.05, "39-43": 187.71, "44-48": 244.02, "49-53": 317.22,
    "54-58": 412.40, "59+": 594.37
  },
  "smart-300": {
    "00-18": 139.48, "19-23": 188.26, "24-28": 222.48, "29-33": 232.45,
    "34-38": 240.21, "39-43": 264.23, "44-48": 343.50, "49-53": 446.55,
    "54-58": 580.52, "59+": 836.70
  },
  "smart-500-enf": {
    "00-18": 161.31, "19-23": 217.74, "24-28": 257.33, "29-33": 268.86,
    "34-38": 277.84, "39-43": 305.63, "44-48": 397.32, "49-53": 516.51,
    "54-58": 671.47, "59+": 967.79
  },
  "smart-500-apt": {
    "00-18": 179.06, "19-23": 241.69, "24-28": 285.63, "29-33": 298.42,
    "34-38": 308.39, "39-43": 339.23, "44-48": 441.00, "49-53": 573.31,
    "54-58": 745.30, "59+": 1074.20
  },
  "smart-prime-enf": {
    "00-18": 169.38, "19-23": 198.18, "24-28": 241.78, "29-33": 290.13,
    "34-38": 304.65, "39-43": 335.11, "44-48": 418.89, "49-53": 506.46,
    "54-58": 633.51, "59+": 1007.92
  },
  "smart-prime-apt": {
    "00-18": 188.01, "19-23": 219.98, "24-28": 268.38, "29-33": 322.05,
    "34-38": 338.17, "39-43": 371.98, "44-48": 464.98, "49-53": 562.19,
    "54-58": 703.22, "59+": 1118.83
  },
  "advance-600-enf-total": {
    "00-18": 202.42, "19-23": 236.84, "24-28": 288.94, "29-33": 346.74,
    "34-38": 364.07, "39-43": 400.48, "44-48": 500.60, "49-53": 605.27,
    "54-58": 757.10, "59+": 1204.55
  },
  "advance-600-apt-total": {
    "00-18": 224.69, "19-23": 262.89, "24-28": 320.72, "29-33": 384.87,
    "34-38": 404.13, "39-43": 444.54, "44-48": 555.68, "49-53": 671.86,
    "54-58": 840.39, "59+": 1337.07
  },
  "advance-700-enf-total": {
    "00-18": 267.39, "19-23": 312.84, "24-28": 381.66, "29-33": 458.00,
    "34-38": 480.91, "39-43": 528.99, "44-48": 661.25, "49-53": 799.50,
    "54-58": 1000.04, "59+": 1591.08
  },
  "advance-700-apt-total": {
    "00-18": 296.80, "19-23": 347.25, "24-28": 423.65, "29-33": 508.38,
    "34-38": 533.81, "39-43": 587.18, "44-48": 733.98, "49-53": 887.43,
    "54-58": 1110.03, "59+": 1766.08
  },
  "premium-900-1-apt-total": {
    "00-18": 541.07, "19-23": 633.05, "24-28": 772.31, "29-33": 926.78,
    "34-38": 973.12, "39-43": 1070.43, "44-48": 1338.05, "49-53": 1617.80,
    "54-58": 2023.61, "59+": 3219.60
  },
  "infinity-1000-1-total": {
    "00-18": 778.97, "19-23": 911.38, "24-28": 1111.87, "29-33": 1334.26,
    "34-38": 1400.98, "39-43": 1541.06, "44-48": 1926.33, "49-53": 2329.07,
    "54-58": 2913.29, "59+": 4635.07
  },
  // Produtos com Reembolso PARCIAL
  "advance-600-enf-parcial": {
    "00-18": 194.32, "19-23": 227.35, "24-28": 277.37, "29-33": 332.84,
    "34-38": 349.48, "39-43": 384.42, "44-48": 480.53, "49-53": 581.00,
    "54-58": 726.75, "59+": 1156.27
  },
  "advance-600-apt-parcial": {
    "00-18": 215.70, "19-23": 252.37, "24-28": 307.90, "29-33": 369.50,
    "34-38": 387.98, "39-43": 426.78, "44-48": 533.48, "49-53": 645.02,
    "54-58": 806.80, "59+": 1283.64
  },
  "advance-700-enf-parcial": {
    "00-18": 238.94, "19-23": 279.55, "24-28": 341.05, "29-33": 409.26,
    "34-38": 429.73, "39-43": 472.70, "44-48": 590.87, "49-53": 714.41,
    "54-58": 893.62, "59+": 1421.76
  },
  "advance-700-apt-parcial": {
    "00-18": 265.40, "19-23": 310.52, "24-28": 378.83, "29-33": 454.58,
    "34-38": 477.32, "39-43": 525.04, "44-48": 656.30, "49-53": 793.52,
    "54-58": 992.57, "59+": 1579.19
  },
  "premium-900-1-enf-total": {
    "00-18": 541.07, "19-23": 633.05, "24-28": 772.31, "29-33": 926.78,
    "34-38": 973.12, "39-43": 1070.43, "44-48": 1338.05, "49-53": 1617.80,
    "54-58": 2023.61, "59+": 3219.60
  },
  "premium-900-1-enf-parcial": {
    "00-18": 308.62, "19-23": 361.08, "24-28": 440.46, "29-33": 528.56,
    "34-38": 554.99, "39-43": 610.49, "44-48": 763.11, "49-53": 922.76,
    "54-58": 1154.06, "59+": 1836.10
  },
  "premium-900-1-apt-parcial": {
    "00-18": 327.78, "19-23": 383.50, "24-28": 467.80, "29-33": 561.36,
    "34-38": 589.43, "39-43": 648.38, "44-48": 810.47, "49-53": 980.05,
    "54-58": 1225.68, "59+": 1950.04
  },
  // Premium 900.1 Care (SEM Rede Dor)
  "premium-900-1-care-enf-total": {
    "00-18": 541.07, "19-23": 633.05, "24-28": 772.31, "29-33": 926.78,
    "34-38": 973.12, "39-43": 1070.43, "44-48": 1338.05, "49-53": 1617.80,
    "54-58": 2023.61, "59+": 3219.60
  },
  "premium-900-1-care-apt-total": {
    "00-18": 575.70, "19-23": 673.56, "24-28": 821.74, "29-33": 986.09,
    "34-38": 1035.40, "39-43": 1138.94, "44-48": 1423.68, "49-53": 1721.33,
    "54-58": 2153.11, "59+": 3425.63
  },
  "premium-900-1-care-enf-parcial": {
    "00-18": 238.94, "19-23": 279.55, "24-28": 341.05, "29-33": 409.26,
    "34-38": 429.73, "39-43": 472.70, "44-48": 590.87, "49-53": 714.41,
    "54-58": 893.62, "59+": 1421.76
  },
  "premium-900-1-care-apt-parcial": {
    "00-18": 265.40, "19-23": 310.52, "24-28": 378.83, "29-33": 454.58,
    "34-38": 477.32, "39-43": 525.04, "44-48": 656.30, "49-53": 793.52,
    "54-58": 992.57, "59+": 1579.19
  },
  "infinity-1000-1-parcial": {
    "00-18": 349.24, "19-23": 408.68, "24-28": 498.49, "29-33": 598.19,
    "34-38": 628.10, "39-43": 690.91, "44-48": 863.64, "49-53": 1044.19,
    "54-58": 1306.11, "59+": 2078.05
  },
};

// Tabela de preços São Paulo - Super Simples MEI - Coparticipação Parcial
const SP_SS_MEI_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": {
    "00-18": 125.11, "19-23": 168.87, "24-28": 199.58, "29-33": 199.58,
    "34-38": 199.58, "39-43": 237.04, "44-48": 308.15, "49-53": 400.60,
    "54-58": 520.78, "59+": 750.59
  },
  "smart-ambulatorial": {
    "00-18": 120.94, "19-23": 131.40, "24-28": 155.29, "29-33": 155.29,
    "34-38": 155.29, "39-43": 184.43, "44-48": 297.85, "49-53": 315.59,
    "54-58": 405.20, "59+": 725.53
  },
  "smart-200": {
    "00-18": 134.84, "19-23": 182.00, "24-28": 215.09, "29-33": 215.09,
    "34-38": 215.09, "39-43": 255.46, "44-48": 332.10, "49-53": 431.73,
    "54-58": 561.25, "59+": 808.92
  },
  "smart-200-up": {
    "00-18": 139.01, "19-23": 187.64, "24-28": 221.76, "29-33": 221.76,
    "34-38": 221.76, "39-43": 263.38, "44-48": 342.39, "49-53": 445.10,
    "54-58": 578.64, "59+": 833.99
  },
  "smart-300": {
    "00-18": 219.44, "19-23": 296.20, "24-28": 350.05, "29-33": 365.74,
    "34-38": 377.95, "39-43": 415.75, "44-48": 540.47, "49-53": 702.61,
    "54-58": 913.40, "59+": 1316.49
  },
  "smart-500-enf": {
    "00-18": 243.35, "19-23": 328.47, "24-28": 388.20, "29-33": 405.60,
    "34-38": 419.14, "39-43": 461.06, "44-48": 599.37, "49-53": 779.18,
    "54-58": 1012.94, "59+": 1459.95
  },
  "smart-500-apt": {
    "00-18": 270.12, "19-23": 364.62, "24-28": 430.91, "29-33": 450.21,
    "34-38": 465.25, "39-43": 511.78, "44-48": 665.31, "49-53": 864.90,
    "54-58": 1124.37, "59+": 1620.55
  },
  "smart-prime-enf": {
    "00-18": 255.52, "19-23": 298.96, "24-28": 364.73, "29-33": 437.67,
    "34-38": 459.55, "39-43": 505.51, "44-48": 631.89, "49-53": 764.02,
    "54-58": 955.63, "59+": 1520.41
  },
  "smart-prime-apt": {
    "00-18": 283.63, "19-23": 331.85, "24-28": 404.86, "29-33": 485.83,
    "34-38": 510.12, "39-43": 561.13, "44-48": 701.42, "49-53": 848.09,
    "54-58": 1060.80, "59+": 1687.74
  },
  "advance-600-enf-total": {
    "00-18": 297.23, "19-23": 347.76, "24-28": 424.26, "29-33": 509.11,
    "34-38": 534.58, "39-43": 588.03, "44-48": 735.04, "49-53": 888.72,
    "54-58": 1111.65, "59+": 1768.65
  },
  "advance-600-apt-total": {
    "00-18": 329.92, "19-23": 386.01, "24-28": 470.92, "29-33": 565.12,
    "34-38": 593.38, "39-43": 652.72, "44-48": 815.90, "49-53": 986.48,
    "54-58": 1233.92, "59+": 1963.18
  },
  "advance-700-enf-total": {
    "00-18": 392.60, "19-23": 459.34, "24-28": 560.39, "29-33": 672.48,
    "34-38": 706.12, "39-43": 776.73, "44-48": 970.92, "49-53": 1173.91,
    "54-58": 1468.36, "59+": 2336.18
  },
  "advance-700-apt-total": {
    "00-18": 435.79, "19-23": 509.87, "24-28": 622.03, "29-33": 746.44,
    "34-38": 783.77, "39-43": 862.14, "44-48": 1077.69, "49-53": 1303.01,
    "54-58": 1629.84, "59+": 2593.11
  },
  "premium-900-1-apt-total": {
    "00-18": 828.82, "19-23": 969.71, "24-28": 1183.04, "29-33": 1419.67,
    "34-38": 1490.67, "39-43": 1639.72, "44-48": 2049.66, "49-53": 2478.18,
    "54-58": 3099.81, "59+": 4931.83
  },
  // PREMIUM 900 (CARE) - Reembolso Total - Coparticipação Parcial
  "premium-900-1-care-enf-total": {
    "00-18": 247.04, "19-23": 289.03, "24-28": 352.61, "29-33": 423.14,
    "34-38": 444.30, "39-43": 488.73, "44-48": 610.92, "49-53": 738.64,
    "54-58": 923.92, "59+": 1469.97
  },
  "premium-900-1-care-apt-total": {
    "00-18": 717.59, "19-23": 839.57, "24-28": 1024.27, "29-33": 1229.14,
    "34-38": 1290.61, "39-43": 1419.66, "44-48": 1774.58, "49-53": 2145.59,
    "54-58": 2683.79, "59+": 4269.94
  },
  // PREMIUM 900 (CARE) - Reembolso Parcial - Coparticipação Parcial
  "premium-900-1-care-enf-parcial": {
    "00-18": 247.04, "19-23": 289.03, "24-28": 352.61, "29-33": 423.14,
    "34-38": 444.30, "39-43": 488.73, "44-48": 610.92, "49-53": 738.64,
    "54-58": 923.92, "59+": 1469.97
  },
  "premium-900-1-care-apt-parcial": {
    "00-18": 274.21, "19-23": 320.82, "24-28": 391.40, "29-33": 469.68,
    "34-38": 493.17, "39-43": 542.49, "44-48": 678.11, "49-53": 819.88,
    "54-58": 1025.55, "59+": 1631.66
  },
  // INFINITY - Reembolso Total - Coparticipação Parcial
  "infinity-1000-1-total": {
    "00-18": 990.28, "19-23": 1158.61, "24-28": 1413.50, "29-33": 1696.22,
    "34-38": 1781.05, "39-43": 1959.15, "44-48": 2448.94, "49-53": 2960.93,
    "54-58": 3703.85, "59+": 5892.55
  },
  // INFINITY - Reembolso Parcial - Coparticipação Parcial
  "infinity-1000-1-parcial": {
    "00-18": 990.28, "19-23": 1158.61, "24-28": 1413.50, "29-33": 1696.22,
    "34-38": 1781.05, "39-43": 1959.15, "44-48": 2448.94, "49-53": 2960.93,
    "54-58": 3703.85, "59+": 5892.55
  },
};

// Tabela de preços São Paulo - Super Simples MEI - Coparticipação Total
const SP_SS_MEI_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": {
    "00-18": 93.83, "19-23": 126.65, "24-28": 149.68, "29-33": 149.68,
    "34-38": 149.68, "39-43": 177.79, "44-48": 231.13, "49-53": 300.47,
    "54-58": 390.61, "59+": 562.98
  },
  "smart-ambulatorial": {
    "00-18": 90.71, "19-23": 98.55, "24-28": 116.47, "29-33": 116.47,
    "34-38": 116.47, "39-43": 138.32, "44-48": 223.39, "49-53": 236.70,
    "54-58": 303.91, "59+": 544.17
  },
  "smart-200": {
    "00-18": 101.13, "19-23": 136.51, "24-28": 161.32, "29-33": 161.32,
    "34-38": 161.32, "39-43": 191.61, "44-48": 249.09, "49-53": 323.82,
    "54-58": 420.96, "59+": 606.72
  },
  "smart-200-up": {
    "00-18": 104.26, "19-23": 140.73, "24-28": 166.33, "29-33": 166.33,
    "34-38": 166.33, "39-43": 197.54, "44-48": 256.80, "49-53": 333.83,
    "54-58": 434.00, "59+": 625.52
  },
  "smart-300": {
    "00-18": 153.60, "19-23": 207.33, "24-28": 245.02, "29-33": 255.99,
    "34-38": 264.54, "39-43": 290.99, "44-48": 378.29, "49-53": 491.78,
    "54-58": 639.31, "59+": 921.43
  },
  "smart-500-enf": {
    "00-18": 182.51, "19-23": 246.36, "24-28": 291.15, "29-33": 304.19,
    "34-38": 314.35, "39-43": 345.79, "44-48": 449.53, "49-53": 584.39,
    "54-58": 759.70, "59+": 1094.95
  },
  "smart-500-apt": {
    "00-18": 202.59, "19-23": 273.46, "24-28": 323.18, "29-33": 337.65,
    "34-38": 348.93, "39-43": 383.82, "44-48": 498.96, "49-53": 648.65,
    "54-58": 843.24, "59+": 1215.35
  },
  "smart-prime-enf": {
    "00-18": 191.64, "19-23": 224.22, "24-28": 273.55, "29-33": 328.26,
    "34-38": 344.67, "39-43": 379.14, "44-48": 473.93, "49-53": 573.03,
    "54-58": 716.74, "59+": 1140.33
  },
  "smart-prime-apt": {
    "00-18": 212.72, "19-23": 248.88, "24-28": 303.63, "29-33": 364.35,
    "34-38": 382.57, "39-43": 420.83, "44-48": 526.04, "49-53": 636.04,
    "54-58": 795.56, "59+": 1265.73
  },
  "advance-600-enf-total": {
    "00-18": 222.92, "19-23": 260.82, "24-28": 318.19, "29-33": 381.83,
    "34-38": 400.92, "39-43": 441.01, "44-48": 551.25, "49-53": 666.51,
    "54-58": 833.69, "59+": 1326.40
  },
  "advance-600-apt-total": {
    "00-18": 247.44, "19-23": 289.51, "24-28": 353.19, "29-33": 423.84,
    "34-38": 445.04, "39-43": 489.53, "44-48": 611.92, "49-53": 739.85,
    "54-58": 925.43, "59+": 1472.37
  },
  "advance-700-enf-total": {
    "00-18": 294.47, "19-23": 344.52, "24-28": 420.31, "29-33": 504.38,
    "34-38": 529.61, "39-43": 582.57, "44-48": 728.22, "49-53": 880.47,
    "54-58": 1101.32, "59+": 1752.22
  },
  "advance-700-apt-total": {
    "00-18": 326.86, "19-23": 382.42, "24-28": 466.56, "29-33": 559.87,
    "34-38": 587.88, "39-43": 646.65, "44-48": 808.32, "49-53": 977.31,
    "54-58": 1222.46, "59+": 1944.95
  },
  "premium-900-1-apt-total": {
    "00-18": 595.85, "19-23": 697.14, "24-28": 850.50, "29-33": 1020.61,
    "34-38": 1071.65, "39-43": 1178.81, "44-48": 1473.52, "49-53": 1781.59,
    "54-58": 2228.48, "59+": 3545.54
  },
  // PREMIUM 900 (CARE) - Reembolso Total - Coparticipação Total
  "premium-900-1-care-enf-total": {
    "00-18": 303.76, "19-23": 355.40, "24-28": 433.57, "29-33": 520.29,
    "34-38": 546.31, "39-43": 600.94, "44-48": 751.18, "49-53": 908.23,
    "54-58": 1136.04, "59+": 1807.46
  },
  "premium-900-1-care-apt-total": {
    "00-18": 515.89, "19-23": 603.59, "24-28": 736.37, "29-33": 883.65,
    "34-38": 927.84, "39-43": 1020.62, "44-48": 1275.78, "49-53": 1542.51,
    "54-58": 1929.43, "59+": 3069.75
  },
  // PREMIUM 900 (CARE) - Reembolso Parcial - Coparticipação Total
  "premium-900-1-care-enf-parcial": {
    "00-18": 303.76, "19-23": 355.40, "24-28": 433.57, "29-33": 520.29,
    "34-38": 546.31, "39-43": 600.94, "44-48": 751.18, "49-53": 908.23,
    "54-58": 1136.04, "59+": 1807.46
  },
  "premium-900-1-care-apt-parcial": {
    "00-18": 337.17, "19-23": 394.48, "24-28": 481.26, "29-33": 577.53,
    "34-38": 606.41, "39-43": 667.04, "44-48": 833.80, "49-53": 1008.13,
    "54-58": 1261.00, "59+": 2006.27
  },
  // INFINITY - Reembolso Total - Coparticipação Total
  "infinity-1000-1-total": {
    "00-18": 742.73, "19-23": 868.98, "24-28": 1060.16, "29-33": 1272.21,
    "34-38": 1335.83, "39-43": 1469.40, "44-48": 1836.76, "49-53": 2220.77,
    "54-58": 2777.82, "59+": 4419.54
  },
  // INFINITY - Reembolso Parcial - Coparticipação Total
  "infinity-1000-1-parcial": {
    "00-18": 742.73, "19-23": 868.98, "24-28": 1060.16, "29-33": 1272.21,
    "34-38": 1335.83, "39-43": 1469.40, "44-48": 1836.76, "49-53": 2220.77,
    "54-58": 2777.82, "59+": 4419.54
  },
};

// Tabela de preços São Paulo - Super Simples 1 Vida - Coparticipação Parcial
const SP_SS_1VIDA_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": {
    "00-18": 153.49, "19-23": 207.18, "24-28": 244.85, "29-33": 244.85,
    "34-38": 244.85, "39-43": 290.81, "44-48": 378.05, "49-53": 491.47,
    "54-58": 638.91, "59+": 920.86
  },
  "smart-200": {
    "00-18": 161.54, "19-23": 218.05, "24-28": 257.69, "29-33": 257.69,
    "34-38": 257.69, "39-43": 306.05, "44-48": 397.86, "49-53": 517.22,
    "54-58": 672.39, "59+": 969.11
  },
  "smart-200-up": {
    "00-18": 214.53, "19-23": 289.57, "24-28": 342.21, "29-33": 342.21,
    "34-38": 342.21, "39-43": 406.44, "44-48": 528.37, "49-53": 686.88,
    "54-58": 892.94, "59+": 1287.00
  },
  "smart-300": {
    "00-18": 308.75, "19-23": 416.75, "24-28": 492.51, "29-33": 514.58,
    "34-38": 531.77, "39-43": 584.95, "44-48": 760.44, "49-53": 988.58,
    "54-58": 1285.16, "59+": 1852.30
  },
  "smart-400-enf": {
    "00-18": 340.95, "19-23": 460.21, "24-28": 543.88, "29-33": 568.25,
    "34-38": 587.22, "39-43": 645.94, "44-48": 839.72, "49-53": 1091.63,
    "54-58": 1419.12, "59+": 2045.37
  },
  "smart-400-apt": {
    "00-18": 378.45, "19-23": 510.83, "24-28": 603.70, "29-33": 630.75,
    "34-38": 651.81, "39-43": 717.00, "44-48": 932.10, "49-53": 1211.73,
    "54-58": 1575.26, "59+": 2270.41
  },
  "smart-500-enf": {
    "00-18": 355.15, "19-23": 479.38, "24-28": 566.53, "29-33": 591.91,
    "34-38": 611.68, "39-43": 672.85, "44-48": 874.71, "49-53": 1137.12,
    "54-58": 1478.26, "59+": 2130.62
  },
  "smart-500-apt": {
    "00-18": 394.22, "19-23": 532.12, "24-28": 628.86, "29-33": 657.03,
    "34-38": 678.97, "39-43": 746.87, "44-48": 970.93, "49-53": 1262.21,
    "54-58": 1640.87, "59+": 2364.99
  },
  "smart-prime-enf": {
    "00-18": 358.85, "19-23": 419.85, "24-28": 512.21, "29-33": 614.66,
    "34-38": 645.40, "39-43": 709.93, "44-48": 887.42, "49-53": 1072.94,
    "54-58": 1342.08, "59+": 2135.26
  },
  "smart-prime-apt": {
    "00-18": 398.33, "19-23": 466.04, "24-28": 568.58, "29-33": 682.30,
    "34-38": 716.41, "39-43": 788.05, "44-48": 985.07, "49-53": 1191.01,
    "54-58": 1489.77, "59+": 2370.23
  },
  "advance-600-enf-total": {
    "00-18": 383.95, "19-23": 449.22, "24-28": 548.05, "29-33": 657.66,
    "34-38": 690.56, "39-43": 759.60, "44-48": 949.50, "49-53": 1148.01,
    "54-58": 1435.97, "59+": 2284.65
  },
  "advance-600-apt-total": {
    "00-18": 426.16, "19-23": 498.61, "24-28": 608.29, "29-33": 729.97,
    "34-38": 766.48, "39-43": 843.13, "44-48": 1053.91, "49-53": 1274.25,
    "54-58": 1593.87, "59+": 2535.87
  },
  "advance-700-enf-total": {
    "00-18": 471.10, "19-23": 551.18, "24-28": 672.43, "29-33": 806.92,
    "34-38": 847.28, "39-43": 932.00, "44-48": 1165.01, "49-53": 1408.57,
    "54-58": 1761.88, "59+": 2803.19
  },
  "advance-700-apt-total": {
    "00-18": 522.93, "19-23": 611.82, "24-28": 746.41, "29-33": 895.69,
    "34-38": 940.48, "39-43": 1034.52, "44-48": 1293.17, "49-53": 1563.53,
    "54-58": 1955.71, "59+": 3111.57
  },
};

// Tabela de preços São Paulo - Super Simples 1 Vida - Coparticipação Total
const SP_SS_1VIDA_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": {
    "00-18": 115.13, "19-23": 155.40, "24-28": 183.65, "29-33": 183.65,
    "34-38": 183.65, "39-43": 218.12, "44-48": 283.56, "49-53": 368.63,
    "54-58": 479.22, "59+": 690.70
  },
  "smart-200": {
    "00-18": 121.17, "19-23": 163.55, "24-28": 193.29, "29-33": 193.29,
    "34-38": 193.29, "39-43": 229.57, "44-48": 298.44, "49-53": 387.97,
    "54-58": 504.36, "59+": 726.93
  },
  "smart-200-up": {
    "00-18": 160.88, "19-23": 217.16, "24-28": 256.64, "29-33": 256.64,
    "34-38": 256.64, "39-43": 304.81, "44-48": 396.25, "49-53": 515.13,
    "54-58": 669.67, "59+": 965.20
  },
  "smart-300": {
    "00-18": 216.12, "19-23": 291.72, "24-28": 344.76, "29-33": 360.20,
    "34-38": 372.23, "39-43": 409.46, "44-48": 532.30, "49-53": 691.99,
    "54-58": 899.58, "59+": 1296.56
  },
  "smart-400-enf": {
    "00-18": 255.71, "19-23": 345.16, "24-28": 407.92, "29-33": 426.20,
    "34-38": 440.43, "39-43": 484.48, "44-48": 629.83, "49-53": 818.78,
    "54-58": 1064.41, "59+": 1534.13
  },
  "smart-400-apt": {
    "00-18": 283.83, "19-23": 383.10, "24-28": 452.75, "29-33": 473.04,
    "34-38": 488.84, "39-43": 537.72, "44-48": 699.04, "49-53": 908.76,
    "54-58": 1181.38, "59+": 1702.73
  },
  "smart-500-enf": {
    "00-18": 266.37, "19-23": 359.55, "24-28": 424.92, "29-33": 443.96,
    "34-38": 458.79, "39-43": 504.67, "44-48": 656.07, "49-53": 852.89,
    "54-58": 1108.76, "59+": 1598.06
  },
  "smart-500-apt": {
    "00-18": 295.66, "19-23": 399.08, "24-28": 471.63, "29-33": 492.76,
    "34-38": 509.22, "39-43": 560.14, "44-48": 728.18, "49-53": 946.63,
    "54-58": 1230.62, "59+": 1773.69
  },
  "smart-prime-enf": {
    "00-18": 269.14, "19-23": 314.89, "24-28": 384.17, "29-33": 461.00,
    "34-38": 484.06, "39-43": 532.46, "44-48": 665.58, "49-53": 804.73,
    "54-58": 1006.60, "59+": 1601.50
  },
  "smart-prime-apt": {
    "00-18": 298.74, "19-23": 349.52, "24-28": 426.42, "29-33": 511.71,
    "34-38": 537.30, "39-43": 591.03, "44-48": 738.78, "49-53": 893.24,
    "54-58": 1117.29, "59+": 1777.63
  },
  "advance-600-enf-total": {
    "00-18": 287.96, "19-23": 336.91, "24-28": 411.02, "29-33": 493.23,
    "34-38": 517.89, "39-43": 569.68, "44-48": 712.09, "49-53": 860.97,
    "54-58": 1076.94, "59+": 1713.41
  },
  "advance-600-apt-total": {
    "00-18": 319.65, "19-23": 373.99, "24-28": 456.25, "29-33": 547.51,
    "34-38": 574.90, "39-43": 632.38, "44-48": 790.49, "49-53": 955.75,
    "54-58": 1195.50, "59+": 1902.05
  },
  "advance-700-enf-total": {
    "00-18": 353.33, "19-23": 413.39, "24-28": 504.33, "29-33": 605.20,
    "34-38": 635.47, "39-43": 699.01, "44-48": 873.77, "49-53": 1056.45,
    "54-58": 1321.44, "59+": 2102.44
  },
  "advance-700-apt-total": {
    "00-18": 392.21, "19-23": 458.87, "24-28": 559.83, "29-33": 671.80,
    "34-38": 705.40, "39-43": 775.93, "44-48": 969.92, "49-53": 1172.69,
    "54-58": 1466.85, "59+": 2333.78
  },
};

// Dados completos de preços
export const PRICE_DATA: PriceData = {
  "sao-paulo": {
    "super-simples-1-vida": {
      "parcial": SP_SS_1VIDA_PARCIAL,
      "total": SP_SS_1VIDA_TOTAL,
    },
    "super-simples-2-29-mei": {
      "parcial": SP_SS_MEI_PARCIAL,
      "total": SP_SS_MEI_TOTAL,
    },
    "super-simples-2-29-demais": {
      "parcial": SP_SS_MEI_PARCIAL, // Usando mesma tabela por simplicidade
      "total": SP_SS_MEI_TOTAL,
    },
    "pme-30-99-compulsorio": {
      "parcial": SP_PME_ADESAO_PARCIAL, // Compulsório tem valores ligeiramente menores
      "total": SP_PME_ADESAO_TOTAL,
    },
    "pme-30-99-adesao": {
      "parcial": SP_PME_ADESAO_PARCIAL,
      "total": SP_PME_ADESAO_TOTAL,
    },
  },
  // Outras cidades usam tabelas similares com pequenas variações
  "campinas": {
    "super-simples-1-vida": { "parcial": SP_SS_1VIDA_PARCIAL, "total": SP_SS_1VIDA_TOTAL },
    "super-simples-2-29-mei": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "super-simples-2-29-demais": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "pme-30-99-compulsorio": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
    "pme-30-99-adesao": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
  },
  "jundiai": {
    "super-simples-1-vida": { "parcial": SP_SS_1VIDA_PARCIAL, "total": SP_SS_1VIDA_TOTAL },
    "super-simples-2-29-mei": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "super-simples-2-29-demais": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "pme-30-99-compulsorio": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
    "pme-30-99-adesao": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
  },
  "mogi-das-cruzes": {
    "super-simples-1-vida": { "parcial": SP_SS_1VIDA_PARCIAL, "total": SP_SS_1VIDA_TOTAL },
    "super-simples-2-29-mei": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "super-simples-2-29-demais": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "pme-30-99-compulsorio": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
    "pme-30-99-adesao": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
  },
  "santos": {
    "super-simples-1-vida": { "parcial": SP_SS_1VIDA_PARCIAL, "total": SP_SS_1VIDA_TOTAL },
    "super-simples-2-29-mei": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "super-simples-2-29-demais": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "pme-30-99-compulsorio": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
    "pme-30-99-adesao": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
  },
  "sao-bernardo": {
    "super-simples-1-vida": { "parcial": SP_SS_1VIDA_PARCIAL, "total": SP_SS_1VIDA_TOTAL },
    "super-simples-2-29-mei": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "super-simples-2-29-demais": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "pme-30-99-compulsorio": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
    "pme-30-99-adesao": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
  },
  "sorocaba": {
    "super-simples-1-vida": { "parcial": SP_SS_1VIDA_PARCIAL, "total": SP_SS_1VIDA_TOTAL },
    "super-simples-2-29-mei": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "super-simples-2-29-demais": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "pme-30-99-compulsorio": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
    "pme-30-99-adesao": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
  },
  "americana": {
    "super-simples-1-vida": { "parcial": SP_SS_1VIDA_PARCIAL, "total": SP_SS_1VIDA_TOTAL },
    "super-simples-2-29-mei": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "super-simples-2-29-demais": { "parcial": SP_SS_MEI_PARCIAL, "total": SP_SS_MEI_TOTAL },
    "pme-30-99-compulsorio": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
    "pme-30-99-adesao": { "parcial": SP_PME_ADESAO_PARCIAL, "total": SP_PME_ADESAO_TOTAL },
  },
};

// Função para obter preço de um produto
export function getProductPrice(
  city: City,
  contractType: ContractType,
  coparticipation: CoparticipationType,
  productId: string,
  ageRange: AgeRange
): number | null {
  const cityData = PRICE_DATA[city];
  if (!cityData) return null;
  
  const contractData = cityData[contractType];
  if (!contractData) return null;
  
  const copartData = contractData[coparticipation];
  if (!copartData) return null;
  
  const productData = copartData[productId];
  if (!productData) return null;
  
  return productData[ageRange] ?? null;
}

// Função para calcular total de uma simulação
export function calculateSimulationTotal(
  city: City,
  contractType: ContractType,
  coparticipation: CoparticipationType,
  productId: string,
  lives: Record<AgeRange, number>
): number {
  let total = 0;
  
  for (const ageRange of AGE_RANGES) {
    const count = lives[ageRange] || 0;
    if (count > 0) {
      const price = getProductPrice(city, contractType, coparticipation, productId, ageRange);
      if (price) {
        total += price * count;
      }
    }
  }
  
  return total;
}

// Função para obter produtos disponíveis para uma configuração
export function getAvailableProducts(
  city: City,
  contractType: ContractType,
  coparticipation: CoparticipationType
): Product[] {
  const cityData = PRICE_DATA[city];
  if (!cityData) return [];
  
  const contractData = cityData[contractType];
  if (!contractData) return [];
  
  const copartData = contractData[coparticipation];
  if (!copartData) return [];
  
  const availableIds = Object.keys(copartData);
  return PRODUCTS.filter(p => availableIds.includes(p.id));
}
