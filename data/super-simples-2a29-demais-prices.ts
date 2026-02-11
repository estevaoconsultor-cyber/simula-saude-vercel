import type { PriceTable } from "./hapvida-prices";

// ===================================================================
// SuperSimples 2 a 29 Vidas - Demais Empresas
// Extraído do PDF: SuperSimples2a29vidas-DemaisEmpresas(1).pdf
// Contratos assinados de 10/02/2026 a 31/03/2026
// PORTE II (2 a 29 vidas)
// Modo estrito absoluto - somente dados explícitos do PDF
// ===================================================================

// ===== TABELAS COMPARTILHADAS (mesmos valores em todas as 5 cidades) =====

// --- COM COPARTICIPAÇÃO PARCIAL (produtos sem reembolso) ---

const SHARED_SMART_AMBULATORIAL_PARCIAL: PriceTable = {
  "00-18": 101.21, "19-23": 109.97, "24-28": 129.96, "29-33": 129.96, "34-38": 129.96, "39-43": 154.35, "44-48": 249.27, "49-53": 264.11, "54-58": 339.10, "59+": 607.18,
};

const SHARED_SMART_200_UP_PARCIAL: PriceTable = {
  "00-18": 116.33, "19-23": 157.02, "24-28": 185.57, "29-33": 185.57, "34-38": 185.57, "39-43": 220.40, "44-48": 286.52, "49-53": 372.47, "54-58": 484.21, "59+": 697.90,
};

const SHARED_SMART_300_ENF_PARCIAL: PriceTable = {
  "00-18": 189.99, "19-23": 256.45, "24-28": 303.07, "29-33": 316.65, "34-38": 327.22, "39-43": 359.95, "44-48": 467.93, "49-53": 608.31, "54-58": 790.81, "59+": 1139.80,
};

const SHARED_SMART_300_APT_PARCIAL: PriceTable = {
  "00-18": 210.70, "19-23": 284.40, "24-28": 336.11, "29-33": 351.18, "34-38": 362.90, "39-43": 399.19, "44-48": 518.94, "49-53": 674.62, "54-58": 877.01, "59+": 1264.03,
};

const SHARED_SMART_500_ENF_PARCIAL: PriceTable = {
  "00-18": 233.88, "19-23": 315.70, "24-28": 373.10, "29-33": 389.81, "34-38": 402.83, "39-43": 443.12, "44-48": 576.05, "49-53": 748.87, "54-58": 973.53, "59+": 1403.14,
};

const SHARED_SMART_PRIME_ENF_PARCIAL: PriceTable = {
  "00-18": 221.24, "19-23": 258.85, "24-28": 315.80, "29-33": 378.96, "34-38": 397.91, "39-43": 437.71, "44-48": 547.14, "49-53": 661.55, "54-58": 827.46, "59+": 1316.49,
};

const SHARED_SMART_PRIME_APT_PARCIAL: PriceTable = {
  "00-18": 245.57, "19-23": 287.32, "24-28": 350.53, "29-33": 420.63, "34-38": 441.66, "39-43": 485.83, "44-48": 607.29, "49-53": 734.27, "54-58": 918.43, "59+": 1461.22,
};

const SHARED_NOSSO_MEDICO_PARCIAL: PriceTable = {
  "00-18": 104.70, "19-23": 141.32, "24-28": 167.02, "29-33": 167.02, "34-38": 167.02, "39-43": 198.37, "44-48": 257.88, "49-53": 335.24, "54-58": 435.81, "59+": 628.13,
};

const SHARED_BASIC_REFERENCIA: PriceTable = {
  "00-18": 916.34, "19-23": 1236.87, "24-28": 1461.74, "29-33": 1527.23, "34-38": 1578.24, "39-43": 1736.06, "44-48": 2256.88, "49-53": 2933.95, "54-58": 3814.13, "59+": 5497.31,
};

// Smart 200 local (mesmo valor em todas as cidades, nome diferente)
const SHARED_SMART_200_LOCAL_PARCIAL: PriceTable = {
  "00-18": 112.84, "19-23": 152.31, "24-28": 180.01, "29-33": 180.01, "34-38": 180.01, "39-43": 213.79, "44-48": 277.93, "49-53": 361.31, "54-58": 469.70, "59+": 676.97,
};

// --- COM COPARTICIPAÇÃO PARCIAL (produtos com reembolso TOTAL) ---

const SHARED_ADV600_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 257.33, "19-23": 301.08, "24-28": 367.31, "29-33": 440.77, "34-38": 462.82, "39-43": 509.09, "44-48": 636.36, "49-53": 769.41, "54-58": 962.41, "59+": 1531.21,
};

const SHARED_ADV600_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 285.64, "19-23": 334.20, "24-28": 407.71, "29-33": 489.27, "34-38": 513.74, "39-43": 565.11, "44-48": 706.39, "49-53": 854.07, "54-58": 1068.30, "59+": 1699.68,
};

const SHARED_ADV700_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 339.91, "19-23": 397.69, "24-28": 485.18, "29-33": 582.23, "34-38": 611.36, "39-43": 672.49, "44-48": 840.62, "49-53": 1016.37, "54-58": 1271.30, "59+": 2022.66,
};

const SHARED_ADV700_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 377.31, "19-23": 441.45, "24-28": 538.56, "29-33": 646.28, "34-38": 678.60, "39-43": 746.45, "44-48": 933.07, "49-53": 1128.15, "54-58": 1411.12, "59+": 2245.12,
};

const SHARED_PREM500_CARE_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 523.84, "19-23": 612.89, "24-28": 747.72, "29-33": 897.28, "34-38": 942.15, "39-43": 1036.36, "44-48": 1295.45, "49-53": 1566.29, "54-58": 1959.18, "59+": 3117.08,
};

const SHARED_PREM500_CARE_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 551.87, "19-23": 645.69, "24-28": 787.74, "29-33": 945.29, "34-38": 992.55, "39-43": 1091.80, "44-48": 1364.75, "49-53": 1650.12, "54-58": 2063.97, "59+": 3283.77,
};

const SHARED_PREM900_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 990.28, "19-23": 1158.61, "24-28": 1413.50, "29-33": 1696.22, "34-38": 1781.05, "39-43": 1959.15, "44-48": 2448.94, "49-53": 2960.93, "54-58": 3703.65, "59+": 5892.55,
};

const SHARED_INFINITY_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 247.04, "19-23": 289.03, "24-28": 352.61, "29-33": 423.14, "34-38": 444.30, "39-43": 488.73, "44-48": 610.92, "49-53": 738.64, "54-58": 923.92, "59+": 1469.97,
};

const SHARED_INFINITY_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 274.21, "19-23": 320.82, "24-28": 391.40, "29-33": 469.68, "34-38": 493.17, "39-43": 542.49, "44-48": 678.11, "49-53": 819.88, "54-58": 1025.55, "59+": 1631.66,
};

// --- COM COPARTICIPAÇÃO PARCIAL (produtos com reembolso PARCIAL) ---

const SHARED_ADV600_ENF_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 247.04, "19-23": 289.03, "24-28": 352.61, "29-33": 423.14, "34-38": 444.30, "39-43": 488.73, "44-48": 610.92, "49-53": 738.64, "54-58": 923.92, "59+": 1469.97,
};

const SHARED_ADV600_APT_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 274.21, "19-23": 320.82, "24-28": 391.40, "29-33": 469.68, "34-38": 493.17, "39-43": 542.49, "44-48": 678.11, "49-53": 819.88, "54-58": 1025.55, "59+": 1631.66,
};

const SHARED_ADV700_ENF_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 303.76, "19-23": 355.40, "24-28": 433.57, "29-33": 520.29, "34-38": 546.31, "39-43": 600.94, "44-48": 751.18, "49-53": 908.23, "54-58": 1136.04, "59+": 1807.46,
};

const SHARED_ADV700_APT_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 337.17, "19-23": 394.48, "24-28": 481.26, "29-33": 577.53, "34-38": 606.41, "39-43": 667.04, "44-48": 833.80, "49-53": 1008.13, "54-58": 1261.00, "59+": 2006.27,
};

// --- COM COPARTICIPAÇÃO TOTAL (produtos sem reembolso) ---

const SHARED_NOSSO_MEDICO_TOTAL: PriceTable = {
  "00-18": 78.52, "19-23": 105.99, "24-28": 125.26, "29-33": 125.26, "34-38": 125.26, "39-43": 148.78, "44-48": 193.41, "49-53": 251.43, "54-58": 326.86, "59+": 471.10,
};

const SHARED_SMART_AMBULATORIAL_TOTAL: PriceTable = {
  "00-18": 75.90, "19-23": 82.46, "24-28": 97.45, "29-33": 97.45, "34-38": 97.45, "39-43": 115.73, "44-48": 186.91, "49-53": 198.04, "54-58": 254.27, "59+": 455.28,
};

const SHARED_SMART_200_UP_TOTAL: PriceTable = {
  "00-18": 87.24, "19-23": 117.76, "24-28": 139.17, "29-33": 139.17, "34-38": 139.17, "39-43": 165.28, "44-48": 214.87, "49-53": 279.34, "54-58": 363.15, "59+": 523.40,
};

const SHARED_SMART_200_LOCAL_TOTAL: PriceTable = {
  "00-18": 84.62, "19-23": 114.22, "24-28": 134.98, "29-33": 134.98, "34-38": 134.98, "39-43": 160.32, "44-48": 208.41, "49-53": 270.94, "54-58": 352.22, "59+": 507.65,
};

const SHARED_SMART_300_ENF_TOTAL: PriceTable = {
  "00-18": 132.90, "19-23": 179.51, "24-28": 212.14, "29-33": 221.64, "34-38": 229.04, "39-43": 251.94, "44-48": 327.52, "49-53": 425.78, "54-58": 553.51, "59+": 797.77,
};

const SHARED_SMART_300_APT_TOTAL: PriceTable = {
  "00-18": 158.03, "19-23": 213.32, "24-28": 252.10, "29-33": 263.39, "34-38": 272.19, "39-43": 299.41, "44-48": 389.24, "49-53": 506.01, "54-58": 657.81, "59+": 948.10,
};

const SHARED_SMART_500_ENF_TOTAL: PriceTable = {
  "00-18": 175.41, "19-23": 236.77, "24-28": 279.82, "29-33": 292.35, "34-38": 302.12, "39-43": 332.33, "44-48": 432.02, "49-53": 561.63, "54-58": 730.12, "59+": 1052.32,
};

const SHARED_SMART_PRIME_ENF_TOTAL: PriceTable = {
  "00-18": 165.93, "19-23": 194.14, "24-28": 236.85, "29-33": 284.22, "34-38": 298.43, "39-43": 328.28, "44-48": 410.35, "49-53": 496.16, "54-58": 620.60, "59+": 987.37,
};

const SHARED_SMART_PRIME_APT_TOTAL: PriceTable = {
  "00-18": 184.18, "19-23": 215.49, "24-28": 262.90, "29-33": 315.48, "34-38": 331.26, "39-43": 364.39, "44-48": 455.49, "49-53": 550.74, "54-58": 688.87, "59+": 1095.99,
};

// --- COM COPARTICIPAÇÃO TOTAL (produtos com reembolso TOTAL) ---

const SHARED_ADV600_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 193.00, "19-23": 225.81, "24-28": 275.48, "29-33": 330.58, "34-38": 347.11, "39-43": 381.82, "44-48": 477.27, "49-53": 577.06, "54-58": 721.81, "59+": 1148.40,
};

const SHARED_ADV600_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 214.23, "19-23": 250.65, "24-28": 305.78, "29-33": 366.94, "34-38": 385.30, "39-43": 423.82, "44-48": 529.78, "49-53": 640.53, "54-58": 801.20, "59+": 1274.72,
};

const SHARED_ADV700_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 254.95, "19-23": 298.29, "24-28": 363.91, "29-33": 436.70, "34-38": 458.55, "39-43": 504.40, "44-48": 630.51, "49-53": 762.33, "54-58": 953.55, "59+": 1517.12,
};

const SHARED_ADV700_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 282.99, "19-23": 331.09, "24-28": 403.93, "29-33": 484.72, "34-38": 508.97, "39-43": 559.86, "44-48": 699.83, "49-53": 846.14, "54-58": 1058.39, "59+": 1683.91,
};

const SHARED_PREM500_CARE_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 392.08, "19-23": 458.73, "24-28": 559.64, "29-33": 671.57, "34-38": 705.15, "39-43": 775.66, "44-48": 969.58, "49-53": 1172.29, "54-58": 1466.34, "59+": 2332.97,
};

const SHARED_PREM500_CARE_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 413.88, "19-23": 484.24, "24-28": 590.77, "29-33": 708.92, "34-38": 744.37, "39-43": 818.81, "44-48": 1023.52, "49-53": 1237.54, "54-58": 1547.91, "59+": 2462.72,
};

const SHARED_PREM900_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 742.73, "19-23": 868.99, "24-28": 1060.16, "29-33": 1272.21, "34-38": 1335.83, "39-43": 1469.40, "44-48": 1836.76, "49-53": 2220.77, "54-58": 2777.82, "59+": 4419.54,
};

const SHARED_INFINITY_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 185.28, "19-23": 216.77, "24-28": 264.46, "29-33": 317.35, "34-38": 333.23, "39-43": 366.55, "44-48": 458.19, "49-53": 553.98, "54-58": 692.95, "59+": 1102.49,
};

const SHARED_INFINITY_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 205.66, "19-23": 240.62, "24-28": 293.56, "29-33": 352.28, "34-38": 369.89, "39-43": 406.88, "44-48": 508.60, "49-53": 614.93, "54-58": 769.17, "59+": 1223.76,
};

// --- COM COPARTICIPAÇÃO TOTAL (produtos com reembolso PARCIAL) ---

const SHARED_ADV600_ENF_PARCIAL_TOTAL: PriceTable = {
  "00-18": 185.28, "19-23": 216.77, "24-28": 264.46, "29-33": 317.35, "34-38": 333.23, "39-43": 366.55, "44-48": 458.19, "49-53": 553.98, "54-58": 692.95, "59+": 1102.49,
};

const SHARED_ADV600_APT_PARCIAL_TOTAL: PriceTable = {
  "00-18": 205.66, "19-23": 240.62, "24-28": 293.56, "29-33": 352.28, "34-38": 369.89, "39-43": 406.88, "44-48": 508.60, "49-53": 614.93, "54-58": 769.17, "59+": 1223.76,
};

const SHARED_ADV700_ENF_PARCIAL_TOTAL: PriceTable = {
  "00-18": 227.82, "19-23": 266.55, "24-28": 325.18, "29-33": 390.22, "34-38": 409.74, "39-43": 450.71, "44-48": 563.39, "49-53": 681.17, "54-58": 852.04, "59+": 1355.61,
};

const SHARED_ADV700_APT_PARCIAL_TOTAL: PriceTable = {
  "00-18": 253.04, "19-23": 296.06, "24-28": 361.19, "29-33": 433.43, "34-38": 455.11, "39-43": 500.62, "44-48": 625.78, "49-53": 756.61, "54-58": 946.39, "59+": 1505.71,
};

// ===== JUNDIAÍ - PRODUTO EXCLUSIVO =====

const JUNDIAI_PLENO_ENF_PARCIAL: PriceTable = {
  "00-18": 145.41, "19-23": 196.27, "24-28": 231.95, "29-33": 242.34, "34-38": 250.44, "39-43": 275.48, "44-48": 358.12, "49-53": 465.56, "54-58": 605.22, "59+": 872.30,
};

const JUNDIAI_PLENO_APT_PARCIAL: PriceTable = {
  "00-18": 161.41, "19-23": 217.87, "24-28": 257.48, "29-33": 269.02, "34-38": 278.01, "39-43": 305.81, "44-48": 397.55, "49-53": 516.81, "54-58": 671.86, "59+": 968.35,
};

// ===== EXPORTS POR CIDADE =====

// --- SÃO PAULO ---
export const SAO_PAULO_SS2A29_DEMAIS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_PARCIAL,
  "smart-200": SHARED_SMART_200_LOCAL_PARCIAL,
  "smart-200-up": SHARED_SMART_200_UP_PARCIAL,
  "smart-300": SHARED_SMART_300_ENF_PARCIAL,
  "smart-500-enf": SHARED_SMART_500_ENF_PARCIAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_PARCIAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_PARCIAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_PARCIAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
};

export const SAO_PAULO_SS2A29_DEMAIS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_TOTAL,
  "smart-200": SHARED_SMART_200_LOCAL_TOTAL,
  "smart-200-up": SHARED_SMART_200_UP_TOTAL,
  "smart-300": SHARED_SMART_300_ENF_TOTAL,
  "smart-500-enf": SHARED_SMART_500_ENF_TOTAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_TOTAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_TOTAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_TOTAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_TOTAL,
  "infinity-1000-1-parcial": SHARED_INFINITY_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
};

// --- JUNDIAÍ ---
export const JUNDIAI_SS2A29_DEMAIS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_PARCIAL,
  "smart-200": SHARED_SMART_200_LOCAL_PARCIAL,
  "smart-200-up": SHARED_SMART_200_UP_PARCIAL,
  "pleno-enf": JUNDIAI_PLENO_ENF_PARCIAL,
  "pleno-apt": JUNDIAI_PLENO_APT_PARCIAL,
  "smart-300": SHARED_SMART_300_ENF_PARCIAL,
  "smart-500-enf": SHARED_SMART_500_ENF_PARCIAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_PARCIAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_PARCIAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_PARCIAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
};

export const JUNDIAI_SS2A29_DEMAIS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_TOTAL,
  "smart-200": SHARED_SMART_200_LOCAL_TOTAL,
  "smart-200-up": SHARED_SMART_200_UP_TOTAL,
  "smart-300": SHARED_SMART_300_ENF_TOTAL,
  "smart-500-enf": SHARED_SMART_500_ENF_TOTAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_TOTAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_TOTAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_TOTAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_TOTAL,
  "infinity-1000-1-parcial": SHARED_INFINITY_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
};

// --- MOGI DAS CRUZES ---
export const MOGI_DAS_CRUZES_SS2A29_DEMAIS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_PARCIAL,
  "smart-200": SHARED_SMART_200_LOCAL_PARCIAL,
  "smart-200-up": SHARED_SMART_200_UP_PARCIAL,
  "smart-300": SHARED_SMART_300_ENF_PARCIAL,
  "smart-500-enf": SHARED_SMART_500_ENF_PARCIAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_PARCIAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_PARCIAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_PARCIAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
};

export const MOGI_DAS_CRUZES_SS2A29_DEMAIS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_TOTAL,
  "smart-200": SHARED_SMART_200_LOCAL_TOTAL,
  "smart-200-up": SHARED_SMART_200_UP_TOTAL,
  "smart-300": SHARED_SMART_300_ENF_TOTAL,
  "smart-500-enf": SHARED_SMART_500_ENF_TOTAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_TOTAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_TOTAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_TOTAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_TOTAL,
  "infinity-1000-1-parcial": SHARED_INFINITY_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
};

// --- SANTOS ---
export const SANTOS_SS2A29_DEMAIS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_PARCIAL,
  "smart-200": SHARED_SMART_200_LOCAL_PARCIAL,
  "smart-200-up": SHARED_SMART_200_UP_PARCIAL,
  "smart-300": SHARED_SMART_300_ENF_PARCIAL,
  "smart-500-enf": SHARED_SMART_500_ENF_PARCIAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_PARCIAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_PARCIAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_PARCIAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
};

export const SANTOS_SS2A29_DEMAIS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_TOTAL,
  "smart-200": SHARED_SMART_200_LOCAL_TOTAL,
  "smart-200-up": SHARED_SMART_200_UP_TOTAL,
  "smart-300": SHARED_SMART_300_ENF_TOTAL,
  "smart-500-enf": SHARED_SMART_500_ENF_TOTAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_TOTAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_TOTAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_TOTAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_TOTAL,
  "infinity-1000-1-parcial": SHARED_INFINITY_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
};

// --- SÃO BERNARDO DO CAMPO ---
export const SAO_BERNARDO_SS2A29_DEMAIS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_PARCIAL,
  "smart-200": SHARED_SMART_200_LOCAL_PARCIAL,
  "smart-200-up": SHARED_SMART_200_UP_PARCIAL,
  "smart-300": SHARED_SMART_300_ENF_PARCIAL,
  "smart-500-enf": SHARED_SMART_500_ENF_PARCIAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_PARCIAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_PARCIAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_PARCIAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
};

export const SAO_BERNARDO_SS2A29_DEMAIS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMBULATORIAL_TOTAL,
  "smart-200": SHARED_SMART_200_LOCAL_TOTAL,
  "smart-200-up": SHARED_SMART_200_UP_TOTAL,
  "smart-300": SHARED_SMART_300_ENF_TOTAL,
  "smart-500-enf": SHARED_SMART_500_ENF_TOTAL,
  "smart-prime-enf": SHARED_SMART_PRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SMART_PRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-1-care-enf-total": SHARED_PREM500_CARE_ENF_TOTAL_TOTAL,
  "premium-900-1-care-apt-total": SHARED_PREM500_CARE_APT_TOTAL_TOTAL,
  "premium-900-1-enf-total": SHARED_PREM900_ENF_TOTAL_TOTAL,
  "infinity-1000-1-total": SHARED_INFINITY_ENF_TOTAL_TOTAL,
  "infinity-1000-1-parcial": SHARED_INFINITY_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
};
