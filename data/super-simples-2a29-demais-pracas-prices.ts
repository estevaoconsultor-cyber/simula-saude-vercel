import type { PriceTable } from "./hapvida-prices";

// ===================================================================
// SuperSimples 2 a 29 Vidas - Demais Praças
// Extraído do PDF: SuperSimples2a29vidas-DemaisPraças.pdf
// Contratos assinados de 10/02/2026 a 31/03/2026
// PORTE II (2 a 29 vidas)
// Modo estrito absoluto - somente dados explícitos do PDF
// 5 cidades: Americana, Campinas, Sorocaba, São José dos Campos, Rio de Janeiro
// ===================================================================

// ===== TABELAS COMPARTILHADAS (Americana, Campinas, Sorocaba) =====

const SHARED_BASIC_REFERENCIA: PriceTable = {
  "00-18": 991.11, "19-23": 1337.79, "24-28": 1581.00, "29-33": 1651.83, "34-38": 1707.00, "39-43": 1877.69, "44-48": 2441.00, "49-53": 3173.31, "54-58": 4125.30, "59+": 5945.80,
};

const SHARED_SMART_AMB_PARCIAL: PriceTable = {
  "00-18": 157.59, "19-23": 171.21, "24-28": 202.34, "29-33": 202.34, "34-38": 202.34, "39-43": 240.30, "44-48": 388.08, "49-53": 411.19, "54-58": 527.95, "59+": 945.33,
};

const SHARED_S200UP_PARCIAL: PriceTable = {
  "00-18": 186.90, "19-23": 252.27, "24-28": 298.13, "29-33": 298.13, "34-38": 298.13, "39-43": 354.09, "44-48": 460.32, "49-53": 598.42, "54-58": 777.94, "59+": 1121.24,
};

const SHARED_S300_PARCIAL: PriceTable = {
  "00-18": 280.70, "19-23": 378.89, "24-28": 447.78, "29-33": 467.84, "34-38": 483.46, "39-43": 531.81, "44-48": 691.35, "49-53": 898.75, "54-58": 1168.37, "59+": 1683.98,
};

const SHARED_S500E_PARCIAL: PriceTable = {
  "00-18": 346.10, "19-23": 467.17, "24-28": 552.10, "29-33": 576.83, "34-38": 596.09, "39-43": 655.69, "44-48": 852.41, "49-53": 1108.13, "54-58": 1440.58, "59+": 2076.31,
};

const SHARED_S500A_PARCIAL: PriceTable = {
  "00-18": 394.56, "19-23": 532.57, "24-28": 629.40, "29-33": 657.59, "34-38": 679.54, "39-43": 747.49, "44-48": 971.75, "49-53": 1263.27, "54-58": 1642.26, "59+": 2366.99,
};

const SHARED_SPRIME_E_PARCIAL: PriceTable = {
  "00-18": 354.87, "19-23": 415.20, "24-28": 506.54, "29-33": 607.85, "34-38": 638.24, "39-43": 702.07, "44-48": 877.59, "49-53": 1061.09, "54-58": 1327.21, "59+": 2111.59,
};

const SHARED_SPRIME_A_PARCIAL: PriceTable = {
  "00-18": 393.90, "19-23": 460.87, "24-28": 562.26, "29-33": 674.72, "34-38": 708.46, "39-43": 779.31, "44-48": 974.14, "49-53": 1177.83, "54-58": 1473.23, "59+": 2343.91,
};

// Reembolso Total - Copay Parcial (compartilhado Americana/Campinas/Sorocaba)
const SHARED_ADV600_AMB_TOTAL_PARCIAL: PriceTable = {
  "00-18": 365.85, "19-23": 428.04, "24-28": 522.20, "29-33": 626.65, "34-38": 657.99, "39-43": 723.78, "44-48": 904.73, "49-53": 1093.89, "54-58": 1368.28, "59+": 2176.94,
};

const SHARED_ADV600_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 406.08, "19-23": 475.11, "24-28": 579.63, "29-33": 695.57, "34-38": 730.36, "39-43": 803.39, "44-48": 1004.24, "49-53": 1214.21, "54-58": 1518.78, "59+": 2416.40,
};

const SHARED_ADV700_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 448.87, "19-23": 525.17, "24-28": 640.69, "29-33": 768.85, "34-38": 807.30, "39-43": 888.01, "44-48": 1110.03, "49-53": 1342.10, "54-58": 1678.75, "59+": 2670.90,
};

const SHARED_ADV700_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 498.27, "19-23": 582.97, "24-28": 711.21, "29-33": 853.46, "34-38": 896.15, "39-43": 985.75, "44-48": 1232.20, "49-53": 1489.82, "54-58": 1863.52, "59+": 2964.90,
};

const SHARED_PREMCARE_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 774.72, "19-23": 906.42, "24-28": 1105.82, "29-33": 1327.00, "34-38": 1393.35, "39-43": 1532.68, "44-48": 1915.86, "49-53": 2316.41, "54-58": 2897.44, "59+": 4609.87,
};

const SHARED_PREM900_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 824.29, "19-23": 964.41, "24-28": 1176.57, "29-33": 1411.90, "34-38": 1482.50, "39-43": 1630.74, "44-48": 2038.44, "49-53": 2464.62, "54-58": 3082.83, "59+": 4904.84,
};

const SHARED_INFINITY_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 1029.89, "19-23": 1204.95, "24-28": 1470.03, "29-33": 1764.06, "34-38": 1852.28, "39-43": 2037.50, "44-48": 2546.88, "49-53": 3079.35, "54-58": 3851.77, "59+": 6128.21,
};

// Reembolso Total - Copay Total (compartilhado Americana/Campinas/Sorocaba)
const SHARED_ADV600_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 274.39, "19-23": 321.03, "24-28": 391.65, "29-33": 469.99, "34-38": 493.49, "39-43": 542.84, "44-48": 678.56, "49-53": 820.42, "54-58": 1026.22, "59+": 1632.74,
};

const SHARED_ADV600_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 304.57, "19-23": 356.34, "24-28": 434.73, "29-33": 521.67, "34-38": 547.76, "39-43": 602.52, "44-48": 753.16, "49-53": 910.62, "54-58": 1139.04, "59+": 1812.24,
};

const SHARED_ADV700_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 336.67, "19-23": 393.90, "24-28": 480.56, "29-33": 576.68, "34-38": 605.53, "39-43": 666.08, "44-48": 832.59, "49-53": 1006.66, "54-58": 1259.16, "59+": 2003.35,
};

const SHARED_ADV700_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 374.23, "19-23": 437.85, "24-28": 534.16, "29-33": 641.00, "34-38": 673.06, "39-43": 740.37, "44-48": 925.47, "49-53": 1118.96, "54-58": 1399.63, "59+": 2226.84,
};

const SHARED_PREMCARE_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 556.96, "19-23": 651.63, "24-28": 794.98, "29-33": 953.98, "34-38": 1001.69, "39-43": 1101.84, "44-48": 1377.31, "49-53": 1665.27, "54-58": 2082.99, "59+": 3314.06,
};

const SHARED_PREM900_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 592.60, "19-23": 693.33, "24-28": 845.85, "29-33": 1015.02, "34-38": 1065.79, "39-43": 1172.35, "44-48": 1465.45, "49-53": 1771.84, "54-58": 2216.29, "59+": 3526.14,
};

const SHARED_INFINITY_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 772.44, "19-23": 903.75, "24-28": 1102.57, "29-33": 1323.10, "34-38": 1389.26, "39-43": 1528.17, "44-48": 1910.22, "49-53": 2309.59, "54-58": 2888.92, "59+": 4596.30,
};

// Copay Total sem reembolso (compartilhado Campinas/Sorocaba)
const SHARED_S300_TOTAL: PriceTable = {
  "00-18": 196.49, "19-23": 265.22, "24-28": 313.43, "29-33": 327.47, "34-38": 338.41, "39-43": 372.25, "44-48": 483.93, "49-53": 629.12, "54-58": 817.85, "59+": 1178.76,
};

const SHARED_S500E_TOTAL: PriceTable = {
  "00-18": 242.28, "19-23": 327.03, "24-28": 386.49, "29-33": 403.80, "34-38": 417.29, "39-43": 459.03, "44-48": 596.73, "49-53": 775.75, "54-58": 1008.47, "59+": 1453.50,
};

const SHARED_S500A_TOTAL: PriceTable = {
  "00-18": 285.88, "19-23": 385.89, "24-28": 456.04, "29-33": 476.46, "34-38": 492.37, "39-43": 541.62, "44-48": 704.10, "49-53": 915.33, "54-58": 1189.92, "59+": 1715.02,
};

const SHARED_SPRIME_E_TOTAL: PriceTable = {
  "00-18": 254.88, "19-23": 298.21, "24-28": 363.81, "29-33": 436.57, "34-38": 458.40, "39-43": 504.24, "44-48": 630.30, "49-53": 762.10, "54-58": 953.23, "59+": 1516.59,
};

const SHARED_SPRIME_A_TOTAL: PriceTable = {
  "00-18": 300.76, "19-23": 351.89, "24-28": 429.31, "29-33": 515.17, "34-38": 540.93, "39-43": 595.02, "44-48": 743.77, "49-53": 899.29, "54-58": 1124.84, "59+": 1789.62,
};

// Smart 400 (Campinas/Sorocaba/RJ) - Copay Parcial
const SHARED_S400E_PARCIAL: PriceTable = {
  "00-18": 286.48, "19-23": 386.68, "24-28": 456.98, "29-33": 477.46, "34-38": 493.41, "39-43": 542.75, "44-48": 705.57, "49-53": 917.24, "54-58": 1192.41, "59+": 1718.62,
};

const SHARED_S400A_PARCIAL: PriceTable = {
  "00-18": 332.32, "19-23": 448.56, "24-28": 530.12, "29-33": 553.87, "34-38": 572.37, "39-43": 629.61, "44-48": 818.49, "49-53": 1064.04, "54-58": 1383.25, "59+": 1993.67,
};

// Smart 400 - Copay Total
const SHARED_S400E_TOTAL: PriceTable = {
  "00-18": 200.54, "19-23": 270.70, "24-28": 319.91, "29-33": 334.24, "34-38": 345.40, "39-43": 379.95, "44-48": 493.93, "49-53": 642.11, "54-58": 834.75, "59+": 1203.12,
};

const SHARED_S400A_TOTAL: PriceTable = {
  "00-18": 240.65, "19-23": 324.83, "24-28": 383.88, "29-33": 401.09, "34-38": 414.50, "39-43": 455.96, "44-48": 592.74, "49-53": 770.57, "54-58": 1001.73, "59+": 1443.79,
};

// ===== AMERICANA =====

const AMERICANA_NOSSO_MEDICO_PARCIAL: PriceTable = {
  "00-18": 143.48, "19-23": 193.67, "24-28": 228.87, "29-33": 228.87, "34-38": 228.87, "39-43": 271.83, "44-48": 353.37, "49-53": 459.37, "54-58": 597.19, "59+": 860.73,
};

const AMERICANA_S200_PARCIAL: PriceTable = {
  "00-18": 167.77, "19-23": 226.46, "24-28": 267.62, "29-33": 267.62, "34-38": 267.62, "39-43": 317.86, "44-48": 413.23, "49-53": 537.20, "54-58": 698.36, "59+": 1006.53,
};

const AMERICANA_NOSSO_MEDICO_TOTAL: PriceTable = {
  "00-18": 107.62, "19-23": 145.27, "24-28": 171.69, "29-33": 171.69, "34-38": 171.69, "39-43": 203.91, "44-48": 265.07, "49-53": 344.59, "54-58": 447.96, "59+": 645.65,
};

const AMERICANA_SMART_AMB_TOTAL: PriceTable = {
  "00-18": 118.19, "19-23": 128.41, "24-28": 151.75, "29-33": 151.75, "34-38": 151.75, "39-43": 180.22, "44-48": 291.06, "49-53": 308.40, "54-58": 395.97, "59+": 709.00,
};

const AMERICANA_S200_TOTAL: PriceTable = {
  "00-18": 125.84, "19-23": 169.86, "24-28": 200.74, "29-33": 200.74, "34-38": 200.74, "39-43": 238.42, "44-48": 309.95, "49-53": 402.95, "54-58": 523.83, "59+": 755.00,
};

const AMERICANA_S200UP_TOTAL: PriceTable = {
  "00-18": 140.16, "19-23": 189.19, "24-28": 223.59, "29-33": 223.59, "34-38": 223.59, "39-43": 265.55, "44-48": 345.21, "49-53": 448.76, "54-58": 583.40, "59+": 840.86,
};

const AMERICANA_S300_TOTAL: PriceTable = {
  "00-18": 196.49, "19-23": 265.22, "24-28": 313.43, "29-33": 327.47, "34-38": 338.41, "39-43": 372.25, "44-48": 483.93, "49-53": 629.12, "54-58": 817.85, "59+": 1178.76,
};

const AMERICANA_S500E_TOTAL: PriceTable = {
  "00-18": 242.28, "19-23": 327.03, "24-28": 386.49, "29-33": 403.80, "34-38": 417.29, "39-43": 459.03, "44-48": 596.73, "49-53": 775.75, "54-58": 1008.47, "59+": 1453.50,
};

const AMERICANA_S500A_TOTAL: PriceTable = {
  "00-18": 285.88, "19-23": 385.89, "24-28": 456.04, "29-33": 476.46, "34-38": 492.37, "39-43": 541.62, "44-48": 704.10, "49-53": 915.33, "54-58": 1189.92, "59+": 1715.02,
};

const AMERICANA_SPRIME_E_TOTAL: PriceTable = {
  "00-18": 254.88, "19-23": 298.21, "24-28": 363.81, "29-33": 436.57, "34-38": 458.40, "39-43": 504.24, "44-48": 630.30, "49-53": 762.10, "54-58": 953.23, "59+": 1516.59,
};

const AMERICANA_SPRIME_A_TOTAL: PriceTable = {
  "00-18": 300.76, "19-23": 351.89, "24-28": 429.31, "29-33": 515.17, "34-38": 540.93, "39-43": 595.02, "44-48": 743.77, "49-53": 899.29, "54-58": 1124.84, "59+": 1789.62,
};

// ===== CAMPINAS =====

const CAMPINAS_NOSSO_MEDICO_PARCIAL: PriceTable = {
  "00-18": 134.01, "19-23": 180.89, "24-28": 213.77, "29-33": 213.77, "34-38": 213.77, "39-43": 253.89, "44-48": 330.05, "49-53": 429.07, "54-58": 557.79, "59+": 803.95,
};

const CAMPINAS_S200_PARCIAL: PriceTable = {
  "00-18": 147.84, "19-23": 199.55, "24-28": 235.83, "29-33": 235.83, "34-38": 235.83, "39-43": 280.09, "44-48": 364.11, "49-53": 473.34, "54-58": 615.34, "59+": 886.89,
};

const CAMPINAS_PLENO_ENF_PARCIAL: PriceTable = {
  "00-18": 187.68, "19-23": 253.33, "24-28": 299.38, "29-33": 312.80, "34-38": 323.25, "39-43": 355.57, "44-48": 462.24, "49-53": 600.91, "54-58": 781.18, "59+": 1125.92,
};

const CAMPINAS_PLENO_APT_PARCIAL: PriceTable = {
  "00-18": 234.60, "19-23": 316.67, "24-28": 374.24, "29-33": 391.00, "34-38": 404.06, "39-43": 444.46, "44-48": 577.79, "49-53": 751.13, "54-58": 976.47, "59+": 1407.39,
};

const CAMPINAS_NOSSO_MEDICO_TOTAL: PriceTable = {
  "00-18": 100.52, "19-23": 135.68, "24-28": 160.35, "29-33": 160.35, "34-38": 160.35, "39-43": 190.45, "44-48": 247.59, "49-53": 321.87, "54-58": 418.44, "59+": 603.10,
};

const CAMPINAS_SMART_AMB_TOTAL: PriceTable = {
  "00-18": 113.64, "19-23": 123.47, "24-28": 145.91, "29-33": 145.91, "34-38": 145.91, "39-43": 173.28, "44-48": 279.85, "49-53": 296.52, "54-58": 380.72, "59+": 681.69,
};

const CAMPINAS_S200_TOTAL: PriceTable = {
  "00-18": 110.88, "19-23": 149.67, "24-28": 176.88, "29-33": 176.88, "34-38": 176.88, "39-43": 210.08, "44-48": 273.10, "49-53": 355.03, "54-58": 461.55, "59+": 665.23,
};

const CAMPINAS_S200UP_TOTAL: PriceTable = {
  "00-18": 116.72, "19-23": 157.55, "24-28": 186.19, "29-33": 186.19, "34-38": 186.19, "39-43": 221.13, "44-48": 287.47, "49-53": 373.72, "54-58": 485.84, "59+": 700.24,
};

const CAMPINAS_PLENO_ENF_TOTAL: PriceTable = {
  "00-18": 136.83, "19-23": 184.69, "24-28": 218.27, "29-33": 228.05, "34-38": 235.66, "39-43": 259.23, "44-48": 337.00, "49-53": 438.10, "54-58": 569.54, "59+": 820.88,
};

const CAMPINAS_PLENO_APT_TOTAL: PriceTable = {
  "00-18": 171.04, "19-23": 230.87, "24-28": 272.84, "29-33": 285.06, "34-38": 294.58, "39-43": 324.04, "44-48": 421.25, "49-53": 547.63, "54-58": 711.92, "59+": 1026.09,
};

// ===== SOROCABA =====

const SOROCABA_NOSSO_MEDICO_PARCIAL: PriceTable = {
  "00-18": 145.57, "19-23": 196.49, "24-28": 232.21, "29-33": 232.21, "34-38": 232.21, "39-43": 275.80, "44-48": 358.53, "49-53": 466.10, "54-58": 605.94, "59+": 873.34,
};

const SOROCABA_S200_PARCIAL: PriceTable = {
  "00-18": 170.73, "19-23": 230.46, "24-28": 272.36, "29-33": 272.36, "34-38": 272.36, "39-43": 323.48, "44-48": 420.53, "49-53": 546.70, "54-58": 710.72, "59+": 1024.36,
};

const SOROCABA_S200UP_PARCIAL: PriceTable = {
  "00-18": 179.71, "19-23": 242.57, "24-28": 286.67, "29-33": 286.67, "34-38": 286.67, "39-43": 340.48, "44-48": 442.63, "49-53": 575.42, "54-58": 748.04, "59+": 1078.15,
};

const SOROCABA_PLENO_ENF_PARCIAL: PriceTable = {
  "00-18": 210.56, "19-23": 284.21, "24-28": 335.88, "29-33": 350.93, "34-38": 362.65, "39-43": 368.92, "44-48": 518.59, "49-53": 674.16, "54-58": 876.41, "59+": 1263.17,
};

const SOROCABA_PLENO_APT_PARCIAL: PriceTable = {
  "00-18": 263.20, "19-23": 355.27, "24-28": 419.85, "29-33": 438.66, "34-38": 453.31, "39-43": 498.64, "44-48": 648.23, "49-53": 842.70, "54-58": 1095.51, "59+": 1578.95,
};

const SOROCABA_NOSSO_MEDICO_TOTAL: PriceTable = {
  "00-18": 109.19, "19-23": 147.38, "24-28": 174.18, "29-33": 174.18, "34-38": 174.18, "39-43": 206.88, "44-48": 268.95, "49-53": 349.64, "54-58": 454.53, "59+": 655.12,
};

const SOROCABA_SMART_AMB_TOTAL: PriceTable = {
  "00-18": 113.64, "19-23": 123.47, "24-28": 145.91, "29-33": 145.91, "34-38": 145.91, "39-43": 173.28, "44-48": 279.85, "49-53": 296.52, "54-58": 380.72, "59+": 681.69,
};

const SOROCABA_S200_TOTAL: PriceTable = {
  "00-18": 128.03, "19-23": 172.82, "24-28": 204.24, "29-33": 204.24, "34-38": 204.24, "39-43": 242.57, "44-48": 315.35, "49-53": 409.96, "54-58": 532.95, "59+": 768.14,
};

const SOROCABA_S200UP_TOTAL: PriceTable = {
  "00-18": 134.77, "19-23": 181.91, "24-28": 214.99, "29-33": 214.99, "34-38": 214.99, "39-43": 255.34, "44-48": 331.94, "49-53": 431.51, "54-58": 560.97, "59+": 808.53,
};

const SOROCABA_PLENO_ENF_TOTAL: PriceTable = {
  "00-18": 153.47, "19-23": 207.15, "24-28": 244.81, "29-33": 255.78, "34-38": 264.32, "39-43": 290.76, "44-48": 377.98, "49-53": 491.38, "54-58": 638.80, "59+": 920.70,
};

const SOROCABA_PLENO_APT_TOTAL: PriceTable = {
  "00-18": 191.84, "19-23": 258.94, "24-28": 306.01, "29-33": 319.72, "34-38": 330.40, "39-43": 363.44, "44-48": 472.47, "49-53": 614.21, "54-58": 798.48, "59+": 1150.85,
};

// ===== SÃO JOSÉ DOS CAMPOS =====

const SJC_PLENO_VP_ENF_PARCIAL: PriceTable = {
  "00-18": 253.77, "19-23": 284.22, "24-28": 318.32, "29-33": 366.07, "34-38": 420.98, "39-43": 500.97, "44-48": 626.22, "49-53": 782.77, "54-58": 1330.71, "59+": 1490.39,
};

const SJC_PLENO_VP_APT_PARCIAL: PriceTable = {
  "00-18": 317.22, "19-23": 355.28, "24-28": 397.91, "29-33": 457.59, "34-38": 526.23, "39-43": 626.21, "44-48": 782.77, "49-53": 978.46, "54-58": 1663.39, "59+": 1862.99,
};

const SJC_PLENO_VP_ENF_TOTAL: PriceTable = {
  "00-18": 175.56, "19-23": 196.63, "24-28": 220.23, "29-33": 253.26, "34-38": 291.25, "39-43": 346.59, "44-48": 433.24, "49-53": 541.56, "54-58": 920.65, "59+": 1031.13,
};

const SJC_PLENO_VP_APT_TOTAL: PriceTable = {
  "00-18": 219.44, "19-23": 245.77, "24-28": 275.26, "29-33": 316.55, "34-38": 364.04, "39-43": 433.21, "44-48": 541.52, "49-53": 676.90, "54-58": 1150.73, "59+": 1288.82,
};

// ===== RIO DE JANEIRO =====

const RIO_SMART_AMB_PARCIAL: PriceTable = {
  "00-18": 140.26, "19-23": 152.39, "24-28": 180.10, "29-33": 180.10, "34-38": 180.10, "39-43": 213.90, "44-48": 345.45, "49-53": 366.02, "54-58": 469.95, "59+": 841.47,
};

const RIO_S150GR_PARCIAL: PriceTable = {
  "00-18": 121.27, "19-23": 164.68, "24-28": 181.15, "29-33": 197.45, "34-38": 200.42, "39-43": 210.44, "44-48": 298.19, "49-53": 402.55, "54-58": 483.06, "59+": 727.48,
};

const RIO_S200RJ_PARCIAL: PriceTable = {
  "00-18": 121.27, "19-23": 164.68, "24-28": 181.15, "29-33": 197.45, "34-38": 200.42, "39-43": 210.44, "44-48": 298.19, "49-53": 402.55, "54-58": 483.06, "59+": 727.48,
};

const RIO_S300_PARCIAL: PriceTable = {
  "00-18": 249.99, "19-23": 337.43, "24-28": 398.78, "29-33": 416.65, "34-38": 430.56, "39-43": 473.62, "44-48": 615.70, "49-53": 800.41, "54-58": 1040.54, "59+": 1499.73,
};

const RIO_S400E_PARCIAL: PriceTable = {
  "00-18": 255.15, "19-23": 344.40, "24-28": 407.01, "29-33": 425.25, "34-38": 439.46, "39-43": 483.40, "44-48": 628.42, "49-53": 816.95, "54-58": 1062.03, "59+": 1530.70,
};

const RIO_S400A_PARCIAL: PriceTable = {
  "00-18": 295.97, "19-23": 399.50, "24-28": 472.13, "29-33": 493.29, "34-38": 509.77, "39-43": 560.74, "44-48": 728.96, "49-53": 947.65, "54-58": 1231.94, "59+": 1775.59,
};

const RIO_S500E_PARCIAL: PriceTable = {
  "00-18": 262.80, "19-23": 354.73, "24-28": 419.22, "29-33": 438.01, "34-38": 452.65, "39-43": 497.91, "44-48": 647.28, "49-53": 841.47, "54-58": 1093.91, "59+": 1576.65,
};

const RIO_S500A_PARCIAL: PriceTable = {
  "00-18": 294.34, "19-23": 397.31, "24-28": 469.54, "29-33": 490.57, "34-38": 506.96, "39-43": 557.66, "44-48": 724.96, "49-53": 942.45, "54-58": 1225.18, "59+": 1765.85,
};

const RIO_SPRIME_E_PARCIAL: PriceTable = {
  "00-18": 276.44, "19-23": 323.43, "24-28": 394.58, "29-33": 473.50, "34-38": 497.18, "39-43": 546.90, "44-48": 683.63, "49-53": 826.58, "54-58": 1033.89, "59+": 1644.92,
};

const RIO_SPRIME_A_PARCIAL: PriceTable = {
  "00-18": 309.61, "19-23": 362.24, "24-28": 441.93, "29-33": 530.32, "34-38": 556.84, "39-43": 612.52, "44-48": 765.65, "49-53": 925.75, "54-58": 1157.93, "59+": 1842.27,
};

const RIO_BASIC_REFERENCIA: PriceTable = {
  "00-18": 916.34, "19-23": 1236.87, "24-28": 1461.74, "29-33": 1527.23, "34-38": 1578.23, "39-43": 1736.06, "44-48": 2256.88, "49-53": 2933.95, "54-58": 3814.13, "59+": 5497.31,
};

// RJ Reembolso Parcial - Copay Parcial
const RIO_ADV600E_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 299.55, "19-23": 350.47, "24-28": 427.57, "29-33": 513.09, "34-38": 538.75, "39-43": 592.62, "44-48": 740.78, "49-53": 895.65, "54-58": 1120.32, "59+": 1782.44,
};

const RIO_ADV600A_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 332.51, "19-23": 389.03, "24-28": 474.62, "29-33": 569.55, "34-38": 598.03, "39-43": 657.83, "44-48": 822.29, "49-53": 994.20, "54-58": 1243.59, "59+": 1978.56,
};

const RIO_ADV700E_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 340.88, "19-23": 398.83, "24-28": 486.56, "29-33": 583.88, "34-38": 613.08, "39-43": 674.39, "44-48": 842.99, "49-53": 1019.23, "54-58": 1274.89, "59+": 2028.37,
};

const RIO_ADV700A_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 378.38, "19-23": 442.70, "24-28": 540.09, "29-33": 648.12, "34-38": 680.53, "39-43": 748.57, "44-48": 935.72, "49-53": 1131.36, "54-58": 1415.14, "59+": 2251.51,
};

const RIO_PREMCARE_APT_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 443.62, "19-23": 519.03, "24-28": 633.21, "29-33": 759.86, "34-38": 797.86, "39-43": 877.64, "44-48": 1097.06, "49-53": 1326.42, "54-58": 1659.14, "59+": 2639.71,
};

// RJ Reembolso Total - Copay Parcial
const RIO_ADV600E_TOTAL_PARCIAL: PriceTable = {
  "00-18": 310.89, "19-23": 363.74, "24-28": 443.76, "29-33": 532.51, "34-38": 559.15, "39-43": 615.05, "44-48": 768.82, "49-53": 929.96, "54-58": 1162.73, "59+": 1849.92,
};

const RIO_ADV600A_TOTAL_PARCIAL: PriceTable = {
  "00-18": 345.07, "19-23": 403.73, "24-28": 492.54, "29-33": 591.06, "34-38": 620.62, "39-43": 682.68, "44-48": 853.35, "49-53": 1031.76, "54-58": 1290.56, "59+": 2053.30,
};

const RIO_ADV700E_TOTAL_PARCIAL: PriceTable = {
  "00-18": 381.45, "19-23": 446.29, "24-28": 544.47, "29-33": 653.37, "34-38": 686.05, "39-43": 754.65, "44-48": 943.32, "49-53": 1140.54, "54-58": 1426.62, "59+": 2269.78,
};

const RIO_ADV700A_TOTAL_PARCIAL: PriceTable = {
  "00-18": 423.42, "19-23": 495.40, "24-28": 604.38, "29-33": 725.26, "34-38": 761.53, "39-43": 837.68, "44-48": 1047.11, "49-53": 1266.03, "54-58": 1583.59, "59+": 2519.52,
};

const RIO_PREMCARE_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 717.59, "19-23": 839.57, "24-28": 1024.27, "29-33": 1229.14, "34-38": 1290.61, "39-43": 1419.66, "44-48": 1774.58, "49-53": 2145.59, "54-58": 2683.79, "59+": 4269.94,
};

const RIO_PREM900A_TOTAL_PARCIAL: PriceTable = {
  "00-18": 763.52, "19-23": 893.31, "24-28": 1089.83, "29-33": 1307.81, "34-38": 1373.21, "39-43": 1510.52, "44-48": 1888.16, "49-53": 2282.92, "54-58": 2855.57, "59+": 4543.24,
};

const RIO_INFINITY_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 990.28, "19-23": 1158.61, "24-28": 1413.50, "29-33": 1696.22, "34-38": 1781.05, "39-43": 1959.15, "44-48": 2448.94, "49-53": 2960.93, "54-58": 3703.65, "59+": 5892.55,
};

// RJ Copay Total - sem reembolso
const RIO_SMART_AMB_TOTAL: PriceTable = {
  "00-18": 105.18, "19-23": 114.27, "24-28": 135.04, "29-33": 135.04, "34-38": 135.04, "39-43": 160.38, "44-48": 259.02, "49-53": 274.45, "54-58": 352.38, "59+": 630.95,
};

const RIO_S150GR_TOTAL: PriceTable = {
  "00-18": 102.67, "19-23": 139.43, "24-28": 153.38, "29-33": 167.18, "34-38": 169.68, "39-43": 178.17, "44-48": 252.46, "49-53": 340.82, "54-58": 408.98, "59+": 616.92,
};

const RIO_S200RJ_TOTAL: PriceTable = {
  "00-18": 102.67, "19-23": 139.43, "24-28": 153.38, "29-33": 167.18, "34-38": 169.68, "39-43": 178.17, "44-48": 252.46, "49-53": 340.82, "54-58": 408.98, "59+": 616.92,
};

const RIO_S300_TOTAL: PriceTable = {
  "00-18": 174.99, "19-23": 236.20, "24-28": 279.14, "29-33": 291.64, "34-38": 301.38, "39-43": 331.52, "44-48": 430.98, "49-53": 560.28, "54-58": 728.36, "59+": 1049.78,
};

const RIO_S400E_TOTAL: PriceTable = {
  "00-18": 178.61, "19-23": 241.09, "24-28": 284.92, "29-33": 297.69, "34-38": 307.63, "39-43": 338.40, "44-48": 439.92, "49-53": 571.90, "54-58": 743.47, "59+": 1071.56,
};

const RIO_S400A_TOTAL: PriceTable = {
  "00-18": 214.33, "19-23": 289.30, "24-28": 341.89, "29-33": 357.21, "34-38": 369.14, "39-43": 406.06, "44-48": 527.88, "49-53": 686.25, "54-58": 892.12, "59+": 1285.31,
};

const RIO_S500E_TOTAL: PriceTable = {
  "00-18": 183.97, "19-23": 248.32, "24-28": 293.46, "29-33": 306.61, "34-38": 316.85, "39-43": 348.54, "44-48": 453.10, "49-53": 589.03, "54-58": 765.74, "59+": 1103.66,
};

const RIO_S500A_TOTAL: PriceTable = {
  "00-18": 220.76, "19-23": 297.98, "24-28": 352.15, "29-33": 367.93, "34-38": 380.22, "39-43": 418.25, "44-48": 543.73, "49-53": 706.85, "54-58": 918.91, "59+": 1324.42,
};

const RIO_SPRIME_E_TOTAL: PriceTable = {
  "00-18": 193.53, "19-23": 226.43, "24-28": 276.24, "29-33": 331.49, "34-38": 348.06, "39-43": 382.87, "44-48": 478.59, "49-53": 578.66, "54-58": 723.79, "59+": 1151.56,
};

const RIO_SPRIME_A_TOTAL: PriceTable = {
  "00-18": 232.24, "19-23": 271.72, "24-28": 331.50, "29-33": 397.80, "34-38": 417.69, "39-43": 459.46, "44-48": 574.33, "49-53": 694.42, "54-58": 868.58, "59+": 1381.91,
};

// RJ Reembolso Parcial - Copay Total
const RIO_ADV600E_PARCIAL_TOTAL: PriceTable = {
  "00-18": 224.67, "19-23": 262.86, "24-28": 320.69, "29-33": 384.83, "34-38": 404.08, "39-43": 444.48, "44-48": 555.60, "49-53": 671.76, "54-58": 840.27, "59+": 1336.87,
};

const RIO_ADV600A_PARCIAL_TOTAL: PriceTable = {
  "00-18": 249.38, "19-23": 291.77, "24-28": 355.96, "29-33": 427.16, "34-38": 448.52, "39-43": 493.37, "44-48": 616.71, "49-53": 745.65, "54-58": 932.68, "59+": 1483.91,
};

const RIO_ADV700E_PARCIAL_TOTAL: PriceTable = {
  "00-18": 255.66, "19-23": 299.12, "24-28": 364.92, "29-33": 437.91, "34-38": 459.81, "39-43": 505.79, "44-48": 632.24, "49-53": 764.42, "54-58": 956.17, "59+": 1521.28,
};

const RIO_ADV700A_PARCIAL_TOTAL: PriceTable = {
  "00-18": 293.97, "19-23": 332.24, "24-28": 405.33, "29-33": 486.40, "34-38": 510.73, "39-43": 561.80, "44-48": 702.25, "49-53": 849.07, "54-58": 1062.05, "59+": 1689.73,
};

const RIO_PREMCARE_APT_PARCIAL_TOTAL: PriceTable = {
  "00-18": 332.99, "19-23": 389.59, "24-28": 475.30, "29-33": 570.37, "34-38": 598.89, "39-43": 658.78, "44-48": 823.48, "49-53": 995.64, "54-58": 1245.38, "59+": 1981.42,
};

// RJ Reembolso Total - Copay Total
const RIO_ADV600E_TOTAL_TOTAL: PriceTable = {
  "00-18": 233.17, "19-23": 272.81, "24-28": 332.82, "29-33": 399.39, "34-38": 419.36, "39-43": 461.30, "44-48": 576.62, "49-53": 697.18, "54-58": 872.06, "59+": 1387.45,
};

const RIO_ADV600A_TOTAL_TOTAL: PriceTable = {
  "00-18": 258.82, "19-23": 302.82, "24-28": 369.43, "29-33": 443.32, "34-38": 465.50, "39-43": 512.04, "44-48": 640.06, "49-53": 773.87, "54-58": 967.99, "59+": 1540.08,
};

const RIO_ADV700E_TOTAL_TOTAL: PriceTable = {
  "00-18": 286.10, "19-23": 334.73, "24-28": 408.37, "29-33": 490.05, "34-38": 514.56, "39-43": 566.01, "44-48": 707.52, "49-53": 855.44, "54-58": 1070.01, "59+": 1702.41,
};

const RIO_ADV700A_TOTAL_TOTAL: PriceTable = {
  "00-18": 317.58, "19-23": 371.56, "24-28": 453.31, "29-33": 543.97, "34-38": 571.18, "39-43": 628.29, "44-48": 785.37, "49-53": 949.56, "54-58": 1187.75, "59+": 1889.73,
};

const RIO_PREMCARE_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 515.89, "19-23": 603.59, "24-28": 736.37, "29-33": 883.65, "34-38": 927.84, "39-43": 1020.62, "44-48": 1275.78, "49-53": 1542.51, "54-58": 1929.43, "59+": 3069.75,
};

const RIO_PREM900A_TOTAL_TOTAL: PriceTable = {
  "00-18": 548.91, "19-23": 642.22, "24-28": 783.50, "29-33": 940.21, "34-38": 987.23, "39-43": 1085.96, "44-48": 1357.44, "49-53": 1641.24, "54-58": 2052.93, "59+": 3266.24,
};

const RIO_INFINITY_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 742.73, "19-23": 868.99, "24-28": 1060.16, "29-33": 1272.21, "34-38": 1335.83, "39-43": 1469.40, "44-48": 1836.76, "49-53": 2220.77, "54-58": 2777.82, "59+": 4419.54,
};

// ===== EXPORTS =====

export const AMERICANA_SS2A29_PRACAS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": AMERICANA_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": AMERICANA_S200_PARCIAL,
  "smart-200-up": SHARED_S200UP_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-500-enf": SHARED_S500E_PARCIAL,
  "smart-500-apt": SHARED_S500A_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_E_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_A_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-amb-total": SHARED_ADV600_AMB_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "infinity-apt-total": SHARED_INFINITY_APT_TOTAL_PARCIAL,
};

export const AMERICANA_SS2A29_PRACAS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": AMERICANA_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": AMERICANA_SMART_AMB_TOTAL,
  "smart-200": AMERICANA_S200_TOTAL,
  "smart-200-up": AMERICANA_S200UP_TOTAL,
  "smart-300": AMERICANA_S300_TOTAL,
  "smart-500-enf": AMERICANA_S500E_TOTAL,
  "smart-500-apt": AMERICANA_S500A_TOTAL,
  "smart-prime-enf": AMERICANA_SPRIME_E_TOTAL,
  "smart-prime-apt": AMERICANA_SPRIME_A_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "infinity-apt-total": SHARED_INFINITY_APT_TOTAL_TOTAL,
};

export const CAMPINAS_SS2A29_PRACAS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": CAMPINAS_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": CAMPINAS_S200_PARCIAL,
  "smart-200-up": SHARED_S200UP_PARCIAL,
  "pleno-enf": CAMPINAS_PLENO_ENF_PARCIAL,
  "pleno-apt": CAMPINAS_PLENO_APT_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-400-enf": SHARED_S400E_PARCIAL,
  "smart-400-apt": SHARED_S400A_PARCIAL,
  "smart-500-enf": SHARED_S500E_PARCIAL,
  "smart-500-apt": SHARED_S500A_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_E_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_A_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-amb-total": SHARED_ADV600_AMB_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "infinity-apt-total": SHARED_INFINITY_APT_TOTAL_PARCIAL,
};

export const CAMPINAS_SS2A29_PRACAS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": CAMPINAS_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": CAMPINAS_SMART_AMB_TOTAL,
  "smart-200": CAMPINAS_S200_TOTAL,
  "smart-200-up": CAMPINAS_S200UP_TOTAL,
  "pleno-enf": CAMPINAS_PLENO_ENF_TOTAL,
  "pleno-apt": CAMPINAS_PLENO_APT_TOTAL,
  "smart-300": SHARED_S300_TOTAL,
  "smart-400-enf": SHARED_S400E_TOTAL,
  "smart-400-apt": SHARED_S400A_TOTAL,
  "smart-500-enf": SHARED_S500E_TOTAL,
  "smart-500-apt": SHARED_S500A_TOTAL,
  "smart-prime-enf": SHARED_SPRIME_E_TOTAL,
  "smart-prime-apt": SHARED_SPRIME_A_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "infinity-apt-total": SHARED_INFINITY_APT_TOTAL_TOTAL,
};

export const SOROCABA_SS2A29_PRACAS_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SOROCABA_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": SOROCABA_S200_PARCIAL,
  "smart-200-up": SOROCABA_S200UP_PARCIAL,
  "pleno-enf": SOROCABA_PLENO_ENF_PARCIAL,
  "pleno-apt": SOROCABA_PLENO_APT_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-400-enf": SHARED_S400E_PARCIAL,
  "smart-400-apt": SHARED_S400A_PARCIAL,
  "smart-500-enf": SHARED_S500E_PARCIAL,
  "smart-500-apt": SHARED_S500A_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_E_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_A_PARCIAL,
  "basic-referencia": SHARED_BASIC_REFERENCIA,
  "advance-600-amb-total": SHARED_ADV600_AMB_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "infinity-apt-total": SHARED_INFINITY_APT_TOTAL_PARCIAL,
};

export const SOROCABA_SS2A29_PRACAS_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SOROCABA_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SOROCABA_SMART_AMB_TOTAL,
  "smart-200": SOROCABA_S200_TOTAL,
  "smart-200-up": SOROCABA_S200UP_TOTAL,
  "pleno-enf": SOROCABA_PLENO_ENF_TOTAL,
  "pleno-apt": SOROCABA_PLENO_APT_TOTAL,
  "smart-300": SHARED_S300_TOTAL,
  "smart-400-enf": SHARED_S400E_TOTAL,
  "smart-400-apt": SHARED_S400A_TOTAL,
  "smart-500-enf": SHARED_S500E_TOTAL,
  "smart-500-apt": SHARED_S500A_TOTAL,
  "smart-prime-enf": SHARED_SPRIME_E_TOTAL,
  "smart-prime-apt": SHARED_SPRIME_A_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "infinity-apt-total": SHARED_INFINITY_APT_TOTAL_TOTAL,
};

export const SJC_SS2A29_PRACAS_PARCIAL: Record<string, PriceTable> = {
  "pleno-vale-paraiba-enf": SJC_PLENO_VP_ENF_PARCIAL,
  "pleno-vale-paraiba-apt": SJC_PLENO_VP_APT_PARCIAL,
};

export const SJC_SS2A29_PRACAS_TOTAL: Record<string, PriceTable> = {
  "pleno-vale-paraiba-enf": SJC_PLENO_VP_ENF_TOTAL,
  "pleno-vale-paraiba-apt": SJC_PLENO_VP_APT_TOTAL,
};

export const RIO_SS2A29_PRACAS_PARCIAL: Record<string, PriceTable> = {
  "smart-ambulatorial": RIO_SMART_AMB_PARCIAL,
  "smart-150-grande-rio": RIO_S150GR_PARCIAL,
  "smart-200": RIO_S200RJ_PARCIAL,
  "smart-300": RIO_S300_PARCIAL,
  "smart-400-enf": RIO_S400E_PARCIAL,
  "smart-400-apt": RIO_S400A_PARCIAL,
  "smart-500-enf": RIO_S500E_PARCIAL,
  "smart-500-apt": RIO_S500A_PARCIAL,
  "smart-prime-enf": RIO_SPRIME_E_PARCIAL,
  "smart-prime-apt": RIO_SPRIME_A_PARCIAL,
  "basic-referencia": RIO_BASIC_REFERENCIA,
  "advance-600-enf-parcial": RIO_ADV600E_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": RIO_ADV600A_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": RIO_ADV700E_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": RIO_ADV700A_PARCIAL_PARCIAL,
  "premium-900-care-apt-parcial": RIO_PREMCARE_APT_PARCIAL_PARCIAL,
  "advance-600-enf-total": RIO_ADV600E_TOTAL_PARCIAL,
  "advance-600-apt-total": RIO_ADV600A_TOTAL_PARCIAL,
  "advance-700-enf-total": RIO_ADV700E_TOTAL_PARCIAL,
  "advance-700-apt-total": RIO_ADV700A_TOTAL_PARCIAL,
  "premium-900-care-apt-total": RIO_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": RIO_PREM900A_TOTAL_PARCIAL,
  "infinity-apt-total": RIO_INFINITY_APT_TOTAL_PARCIAL,
};

export const RIO_SS2A29_PRACAS_TOTAL: Record<string, PriceTable> = {
  "smart-ambulatorial": RIO_SMART_AMB_TOTAL,
  "smart-150-grande-rio": RIO_S150GR_TOTAL,
  "smart-200": RIO_S200RJ_TOTAL,
  "smart-300": RIO_S300_TOTAL,
  "smart-400-enf": RIO_S400E_TOTAL,
  "smart-400-apt": RIO_S400A_TOTAL,
  "smart-500-enf": RIO_S500E_TOTAL,
  "smart-500-apt": RIO_S500A_TOTAL,
  "smart-prime-enf": RIO_SPRIME_E_TOTAL,
  "smart-prime-apt": RIO_SPRIME_A_TOTAL,
  "advance-600-enf-parcial": RIO_ADV600E_PARCIAL_TOTAL,
  "advance-600-apt-parcial": RIO_ADV600A_PARCIAL_TOTAL,
  "advance-700-enf-parcial": RIO_ADV700E_PARCIAL_TOTAL,
  "advance-700-apt-parcial": RIO_ADV700A_PARCIAL_TOTAL,
  "premium-900-care-apt-parcial": RIO_PREMCARE_APT_PARCIAL_TOTAL,
  "advance-600-enf-total": RIO_ADV600E_TOTAL_TOTAL,
  "advance-600-apt-total": RIO_ADV600A_TOTAL_TOTAL,
  "advance-700-enf-total": RIO_ADV700E_TOTAL_TOTAL,
  "advance-700-apt-total": RIO_ADV700A_TOTAL_TOTAL,
  "premium-900-care-apt-total": RIO_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": RIO_PREM900A_TOTAL_TOTAL,
  "infinity-apt-total": RIO_INFINITY_APT_TOTAL_TOTAL,
};
