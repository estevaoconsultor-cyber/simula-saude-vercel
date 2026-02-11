import type { PriceTable } from "./hapvida-prices";

// ============================================================
// SuperSimples 2a29 Vidas - MEI
// PDF: SuperSimples2a29vidas-MEI.pdf
// 5 cidades: São Paulo, Jundiaí, Mogi das Cruzes, Santos, SBC
// Sem Infinity. Sem Premium 900 (sem Care) no reembolso parcial.
// ============================================================

// --- SHARED TABLES (reembolso) ---
// Reembolso Total + Copay Parcial
const SHARED_ADV600_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 297.23, "19-23": 347.76, "24-28": 424.26, "29-33": 509.11, "34-38": 534.58, "39-43": 588.03, "44-48": 735.04, "49-53": 888.72, "54-58": 1111.65, "59+": 1768.65,
};
const SHARED_ADV600_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 329.92, "19-23": 386.01, "24-28": 470.92, "29-33": 565.12, "34-38": 593.38, "39-43": 652.72, "44-48": 815.90, "49-53": 986.48, "54-58": 1233.92, "59+": 1963.18,
};
const SHARED_ADV700_ENF_TOTAL_PARCIAL: PriceTable = {
  "00-18": 392.60, "19-23": 459.34, "24-28": 560.39, "29-33": 672.48, "34-38": 706.12, "39-43": 776.73, "44-48": 970.92, "49-53": 1173.91, "54-58": 1468.36, "59+": 2336.18,
};
const SHARED_ADV700_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 435.79, "19-23": 509.87, "24-28": 622.03, "29-33": 746.44, "34-38": 783.77, "39-43": 862.14, "44-48": 1077.69, "49-53": 1303.01, "54-58": 1629.84, "59+": 2593.11,
};
const SHARED_PREMCARE_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 605.04, "19-23": 707.89, "24-28": 863.62, "29-33": 1036.36, "34-38": 1088.19, "39-43": 1197.00, "44-48": 1496.25, "49-53": 1809.07, "54-58": 2262.86, "59+": 3600.24,
};
const SHARED_PREM900_APT_TOTAL_PARCIAL: PriceTable = {
  "00-18": 637.41, "19-23": 745.77, "24-28": 909.84, "29-33": 1091.81, "34-38": 1146.40, "39-43": 1261.04, "44-48": 1576.30, "49-53": 1905.90, "54-58": 2383.90, "59+": 3792.78,
};

// Reembolso Parcial + Copay Parcial
const SHARED_ADV600_ENF_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 285.33, "19-23": 333.83, "24-28": 407.27, "29-33": 488.73, "34-38": 513.18, "39-43": 564.50, "44-48": 705.63, "49-53": 853.15, "54-58": 1067.16, "59+": 1697.86,
};
const SHARED_ADV600_APT_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 316.72, "19-23": 370.55, "24-28": 452.08, "29-33": 542.50, "34-38": 569.63, "39-43": 626.59, "44-48": 783.23, "49-53": 946.97, "54-58": 1184.52, "59+": 1884.58,
};
const SHARED_ADV700_ENF_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 350.85, "19-23": 410.49, "24-28": 500.78, "29-33": 600.94, "34-38": 630.99, "39-43": 694.09, "44-48": 867.62, "49-53": 1049.01, "54-58": 1312.13, "59+": 2087.62,
};
const SHARED_ADV700_APT_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 389.44, "19-23": 455.64, "24-28": 555.88, "29-33": 667.07, "34-38": 700.43, "39-43": 770.46, "44-48": 963.08, "49-53": 1164.44, "54-58": 1456.52, "59+": 2317.35,
};
const SHARED_PREMCARE_APT_PARCIAL_PARCIAL: PriceTable = {
  "00-18": 494.45, "19-23": 578.50, "24-28": 705.76, "29-33": 846.92, "34-38": 889.27, "39-43": 978.19, "44-48": 1222.75, "49-53": 1478.39, "54-58": 1849.23, "59+": 2942.15,
};

// Reembolso Total + Copay Total
const SHARED_ADV600_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 222.92, "19-23": 260.82, "24-28": 318.19, "29-33": 381.83, "34-38": 400.92, "39-43": 441.01, "44-48": 551.25, "49-53": 666.51, "54-58": 833.69, "59+": 1326.40,
};
const SHARED_ADV600_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 247.44, "19-23": 289.51, "24-28": 353.19, "29-33": 423.84, "34-38": 445.04, "39-43": 489.53, "44-48": 611.92, "49-53": 739.85, "54-58": 925.43, "59+": 1472.37,
};
const SHARED_ADV700_ENF_TOTAL_TOTAL: PriceTable = {
  "00-18": 294.47, "19-23": 344.52, "24-28": 420.31, "29-33": 504.38, "34-38": 529.61, "39-43": 582.57, "44-48": 728.22, "49-53": 880.47, "54-58": 1101.32, "59+": 1752.22,
};
const SHARED_ADV700_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 326.86, "19-23": 382.42, "24-28": 466.56, "29-33": 559.87, "34-38": 587.88, "39-43": 646.65, "44-48": 808.32, "49-53": 977.31, "54-58": 1222.46, "59+": 1944.95,
};
const SHARED_PREMCARE_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 452.85, "19-23": 529.93, "24-28": 646.38, "29-33": 775.66, "34-38": 814.45, "39-43": 895.89, "44-48": 1119.87, "49-53": 1354.00, "54-58": 1693.63, "59+": 2694.59,
};
const SHARED_PREM900_APT_TOTAL_TOTAL: PriceTable = {
  "00-18": 478.03, "19-23": 559.29, "24-28": 682.34, "29-33": 818.81, "34-38": 859.75, "39-43": 945.72, "44-48": 1182.15, "49-53": 1429.34, "54-58": 1787.82, "59+": 2844.42,
};

// Reembolso Parcial + Copay Total
const SHARED_ADV600_ENF_PARCIAL_TOTAL: PriceTable = {
  "00-18": 214.00, "19-23": 250.38, "24-28": 305.47, "29-33": 366.56, "34-38": 384.90, "39-43": 423.38, "44-48": 529.23, "49-53": 639.87, "54-58": 800.38, "59+": 1273.41,
};
const SHARED_ADV600_APT_PARCIAL_TOTAL: PriceTable = {
  "00-18": 237.54, "19-23": 277.92, "24-28": 339.06, "29-33": 406.88, "34-38": 427.22, "39-43": 469.94, "44-48": 587.42, "49-53": 710.23, "54-58": 888.38, "59+": 1413.42,
};
const SHARED_ADV700_ENF_PARCIAL_TOTAL: PriceTable = {
  "00-18": 263.14, "19-23": 307.87, "24-28": 375.59, "29-33": 450.71, "34-38": 473.26, "39-43": 520.58, "44-48": 650.73, "49-53": 786.77, "54-58": 984.13, "59+": 1565.77,
};
const SHARED_ADV700_APT_PARCIAL_TOTAL: PriceTable = {
  "00-18": 292.26, "19-23": 341.94, "24-28": 417.17, "29-33": 500.61, "34-38": 525.65, "39-43": 578.22, "44-48": 722.78, "49-53": 873.89, "54-58": 1093.09, "59+": 1739.11,
};
const SHARED_PREMCARE_APT_PARCIAL_TOTAL: PriceTable = {
  "00-18": 371.14, "19-23": 434.22, "24-28": 529.75, "29-33": 635.71, "34-38": 667.50, "39-43": 734.25, "44-48": 917.82, "49-53": 1109.70, "54-58": 1388.05, "59+": 2208.41,
};

// --- SHARED sem reembolso (usadas por SP, Mogi, Santos, SBC) ---
const SHARED_NOSSO_MEDICO_PARCIAL: PriceTable = {
  "00-18": 125.11, "19-23": 168.87, "24-28": 199.58, "29-33": 199.58, "34-38": 199.58, "39-43": 237.04, "44-48": 308.15, "49-53": 400.60, "54-58": 520.78, "59+": 750.59,
};
const SHARED_BASIC_REF: PriceTable = {
  "00-18": 916.34, "19-23": 1236.87, "24-28": 1461.74, "29-33": 1527.23, "34-38": 1578.24, "39-43": 1736.06, "44-48": 2256.88, "49-53": 2933.95, "54-58": 3814.13, "59+": 5497.31,
};
const SHARED_SMART_AMB_PARCIAL: PriceTable = {
  "00-18": 120.94, "19-23": 131.40, "24-28": 155.29, "29-33": 155.29, "34-38": 155.29, "39-43": 184.43, "44-48": 297.85, "49-53": 315.59, "54-58": 405.20, "59+": 725.53,
};
const SHARED_S200UP_PARCIAL: PriceTable = {
  "00-18": 139.01, "19-23": 187.64, "24-28": 221.76, "29-33": 221.76, "34-38": 221.76, "39-43": 263.38, "44-48": 342.39, "49-53": 445.10, "54-58": 578.64, "59+": 833.99,
};
const SHARED_S300_PARCIAL: PriceTable = {
  "00-18": 219.44, "19-23": 296.20, "24-28": 350.05, "29-33": 365.74, "34-38": 377.95, "39-43": 415.75, "44-48": 540.47, "49-53": 702.61, "54-58": 913.40, "59+": 1316.49,
};
const SHARED_S500_ENF_PARCIAL: PriceTable = {
  "00-18": 243.35, "19-23": 328.47, "24-28": 388.20, "29-33": 405.60, "34-38": 419.14, "39-43": 461.06, "44-48": 599.37, "49-53": 779.18, "54-58": 1012.94, "59+": 1459.95,
};
const SHARED_S500_APT_PARCIAL: PriceTable = {
  "00-18": 270.12, "19-23": 364.62, "24-28": 430.91, "29-33": 450.21, "34-38": 465.25, "39-43": 511.78, "44-48": 665.31, "49-53": 864.90, "54-58": 1124.37, "59+": 1620.55,
};
const SHARED_SPRIME_ENF_PARCIAL: PriceTable = {
  "00-18": 255.52, "19-23": 298.96, "24-28": 364.73, "29-33": 437.67, "34-38": 459.55, "39-43": 505.51, "44-48": 631.89, "49-53": 764.02, "54-58": 955.63, "59+": 1520.41,
};
const SHARED_SPRIME_APT_PARCIAL: PriceTable = {
  "00-18": 283.63, "19-23": 331.85, "24-28": 404.86, "29-33": 485.83, "34-38": 510.12, "39-43": 561.13, "44-48": 701.42, "49-53": 848.09, "54-58": 1060.80, "59+": 1687.74,
};

// Copay Total sem reembolso (shared)
const SHARED_NOSSO_MEDICO_TOTAL: PriceTable = {
  "00-18": 93.83, "19-23": 126.65, "24-28": 149.68, "29-33": 149.68, "34-38": 149.68, "39-43": 177.79, "44-48": 231.13, "49-53": 300.47, "54-58": 390.61, "59+": 562.98,
};
const SHARED_SMART_AMB_TOTAL: PriceTable = {
  "00-18": 90.71, "19-23": 98.55, "24-28": 116.47, "29-33": 116.47, "34-38": 116.47, "39-43": 138.32, "44-48": 223.39, "49-53": 236.70, "54-58": 303.91, "59+": 544.17,
};
const SHARED_S200UP_TOTAL: PriceTable = {
  "00-18": 104.26, "19-23": 140.73, "24-28": 166.33, "29-33": 166.33, "34-38": 166.33, "39-43": 197.54, "44-48": 256.80, "49-53": 333.83, "54-58": 434.00, "59+": 625.52,
};
const SHARED_S300_TOTAL: PriceTable = {
  "00-18": 153.60, "19-23": 207.33, "24-28": 245.02, "29-33": 255.99, "34-38": 264.54, "39-43": 290.99, "44-48": 378.29, "49-53": 491.78, "54-58": 639.31, "59+": 921.43,
};
const SHARED_S500_ENF_TOTAL: PriceTable = {
  "00-18": 182.51, "19-23": 246.36, "24-28": 291.15, "29-33": 304.19, "34-38": 314.35, "39-43": 345.79, "44-48": 449.53, "49-53": 584.39, "54-58": 759.70, "59+": 1094.95,
};
const SHARED_S500_APT_TOTAL: PriceTable = {
  "00-18": 202.59, "19-23": 273.46, "24-28": 323.18, "29-33": 337.65, "34-38": 348.93, "39-43": 383.82, "44-48": 498.96, "49-53": 648.65, "54-58": 843.24, "59+": 1215.35,
};
const SHARED_SPRIME_ENF_TOTAL: PriceTable = {
  "00-18": 191.64, "19-23": 224.22, "24-28": 273.55, "29-33": 328.26, "34-38": 344.67, "39-43": 379.14, "44-48": 473.93, "49-53": 573.03, "54-58": 716.74, "59+": 1140.33,
};
const SHARED_SPRIME_APT_TOTAL: PriceTable = {
  "00-18": 212.72, "19-23": 248.88, "24-28": 303.63, "29-33": 364.35, "34-38": 382.57, "39-43": 420.83, "44-48": 526.04, "49-53": 636.04, "54-58": 795.56, "59+": 1265.73,
};

// --- SÃO PAULO ---
const SP_S200_PARCIAL: PriceTable = {
  "00-18": 134.84, "19-23": 182.00, "24-28": 215.09, "29-33": 215.09, "34-38": 215.09, "39-43": 255.46, "44-48": 332.10, "49-53": 431.73, "54-58": 561.25, "59+": 808.92,
};
const SP_S200_TOTAL: PriceTable = {
  "00-18": 101.13, "19-23": 136.51, "24-28": 161.32, "29-33": 161.32, "34-38": 161.32, "39-43": 191.61, "44-48": 249.09, "49-53": 323.82, "54-58": 420.96, "59+": 606.72,
};

export const SAO_PAULO_MEI_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "basic-referencia": SHARED_BASIC_REF,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": SP_S200_PARCIAL,
  "smart-200-up": SHARED_S200UP_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-500-enf": SHARED_S500_ENF_PARCIAL,
  "smart-500-apt": SHARED_S500_APT_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_APT_PARCIAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_PARCIAL,
};

export const SAO_PAULO_MEI_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMB_TOTAL,
  "smart-200": SP_S200_TOTAL,
  "smart-200-up": SHARED_S200UP_TOTAL,
  "smart-300": SHARED_S300_TOTAL,
  "smart-500-enf": SHARED_S500_ENF_TOTAL,
  "smart-500-apt": SHARED_S500_APT_TOTAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SPRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_TOTAL,
};


// --- JUNDIAÍ ---
// Jundiaí tem: Nosso Médico Jundiaí, Smart 200 Jundiaí, Pleno Jundiaí ENF/APT (exclusivos)
const JUND_NOSSO_MEDICO_PARCIAL: PriceTable = SHARED_NOSSO_MEDICO_PARCIAL; // mesmo valor
const JUND_S200_PARCIAL: PriceTable = {
  "00-18": 134.84, "19-23": 182.00, "24-28": 215.09, "29-33": 215.09, "34-38": 215.09, "39-43": 255.46, "44-48": 332.10, "49-53": 431.73, "54-58": 561.25, "59+": 808.92,
};
const JUND_PLENO_ENF_PARCIAL: PriceTable = {
  "00-18": 173.76, "19-23": 234.53, "24-28": 277.17, "29-33": 289.58, "34-38": 299.26, "39-43": 329.17, "44-48": 427.92, "49-53": 556.30, "54-58": 723.19, "59+": 1042.33,
};
const JUND_PLENO_APT_PARCIAL: PriceTable = {
  "00-18": 192.87, "19-23": 260.33, "24-28": 307.66, "29-33": 321.45, "34-38": 332.19, "39-43": 365.41, "44-48": 475.03, "49-53": 617.54, "54-58": 802.80, "59+": 1157.08,
};
const JUND_S200_TOTAL: PriceTable = {
  "00-18": 101.13, "19-23": 136.51, "24-28": 161.32, "29-33": 161.32, "34-38": 161.32, "39-43": 191.61, "44-48": 249.09, "49-53": 323.82, "54-58": 420.96, "59+": 606.72,
};
const JUND_PLENO_ENF_TOTAL: PriceTable = {
  "00-18": 130.33, "19-23": 175.91, "24-28": 207.90, "29-33": 217.21, "34-38": 224.47, "39-43": 248.92, "44-48": 321.00, "49-53": 417.30, "54-58": 542.49, "59+": 781.89,
};
const JUND_PLENO_APT_TOTAL: PriceTable = {
  "00-18": 144.67, "19-23": 195.27, "24-28": 230.77, "29-33": 241.11, "34-38": 249.16, "39-43": 274.08, "44-48": 356.31, "49-53": 463.20, "54-58": 602.18, "59+": 867.90,
};

export const JUNDIAI_MEI_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": JUND_NOSSO_MEDICO_PARCIAL,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": JUND_S200_PARCIAL,
  "basic-referencia": SHARED_BASIC_REF,
  "smart-200-up": SHARED_S200UP_PARCIAL,
  "pleno-enf": JUND_PLENO_ENF_PARCIAL,
  "pleno-apt": JUND_PLENO_APT_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-500-enf": SHARED_S500_ENF_PARCIAL,
  "smart-500-apt": SHARED_S500_APT_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_APT_PARCIAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_PARCIAL,
};

export const JUNDIAI_MEI_TOTAL: Record<string, PriceTable> = {
  "smart-ambulatorial": SHARED_SMART_AMB_TOTAL,
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-200": JUND_S200_TOTAL,
  "smart-200-up": SHARED_S200UP_TOTAL,
  "pleno-enf": JUND_PLENO_ENF_TOTAL,
  "pleno-apt": JUND_PLENO_APT_TOTAL,
  "smart-300": SHARED_S300_TOTAL,
  "smart-500-enf": SHARED_S500_ENF_TOTAL,
  "smart-500-apt": SHARED_S500_APT_TOTAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SPRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_TOTAL,
};

// --- MOGI DAS CRUZES ---
// Mogi tem Smart 200 Alto Tietê (não SP Capital)
const MOGI_S200_PARCIAL: PriceTable = {
  "00-18": 134.84, "19-23": 182.01, "24-28": 215.09, "29-33": 215.09, "34-38": 215.09, "39-43": 255.46, "44-48": 332.10, "49-53": 431.74, "54-58": 561.27, "59+": 808.95,
};
const MOGI_S200_TOTAL: PriceTable = {
  "00-18": 101.13, "19-23": 136.51, "24-28": 161.32, "29-33": 161.32, "34-38": 161.32, "39-43": 191.61, "44-48": 249.08, "49-53": 323.81, "54-58": 420.98, "59+": 606.73,
};

export const MOGI_MEI_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "basic-referencia": SHARED_BASIC_REF,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": MOGI_S200_PARCIAL,
  "smart-200-up": SHARED_S200UP_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-500-enf": SHARED_S500_ENF_PARCIAL,
  "smart-500-apt": SHARED_S500_APT_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_APT_PARCIAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_PARCIAL,
};

export const MOGI_MEI_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMB_TOTAL,
  "smart-200": MOGI_S200_TOTAL,
  "smart-200-up": SHARED_S200UP_TOTAL,
  "smart-300": SHARED_S300_TOTAL,
  "smart-500-enf": SHARED_S500_ENF_TOTAL,
  "smart-500-apt": SHARED_S500_APT_TOTAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SPRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_TOTAL,
};

// --- SANTOS ---
// Santos tem Smart 200 ABC+BS (não SP Capital)
const SANTOS_S200_PARCIAL: PriceTable = {
  "00-18": 134.84, "19-23": 182.00, "24-28": 215.09, "29-33": 215.09, "34-38": 215.09, "39-43": 255.46, "44-48": 332.10, "49-53": 431.73, "54-58": 561.25, "59+": 808.92,
};
const SANTOS_S200_TOTAL: PriceTable = {
  "00-18": 101.13, "19-23": 136.51, "24-28": 161.32, "29-33": 161.32, "34-38": 161.32, "39-43": 191.61, "44-48": 249.09, "49-53": 323.82, "54-58": 420.98, "59+": 606.72,
};

export const SANTOS_MEI_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "basic-referencia": SHARED_BASIC_REF,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": SANTOS_S200_PARCIAL,
  "smart-200-up": SHARED_S200UP_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-500-enf": SHARED_S500_ENF_PARCIAL,
  "smart-500-apt": SHARED_S500_APT_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_APT_PARCIAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_PARCIAL,
};

export const SANTOS_MEI_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMB_TOTAL,
  "smart-200": SANTOS_S200_TOTAL,
  "smart-200-up": SHARED_S200UP_TOTAL,
  "smart-300": SHARED_S300_TOTAL,
  "smart-500-enf": SHARED_S500_ENF_TOTAL,
  "smart-500-apt": SHARED_S500_APT_TOTAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SPRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_TOTAL,
};

// --- SÃO BERNARDO DO CAMPO ---
// SBC tem Smart 200 ABC+BS + Smart 150 ABC exclusivo no copay total
const SBC_S200_PARCIAL: PriceTable = {
  "00-18": 134.84, "19-23": 182.00, "24-28": 215.09, "29-33": 215.09, "34-38": 215.09, "39-43": 255.46, "44-48": 332.10, "49-53": 431.73, "54-58": 561.25, "59+": 808.92,
};
const SBC_S200_TOTAL: PriceTable = {
  "00-18": 101.13, "19-23": 136.51, "24-28": 161.32, "29-33": 161.32, "34-38": 161.32, "39-43": 191.61, "44-48": 249.09, "49-53": 323.82, "54-58": 420.98, "59+": 606.72,
};
const SBC_S150_ABC_TOTAL: PriceTable = {
  "00-18": 99.05, "19-23": 133.70, "24-28": 157.99, "29-33": 157.99, "34-38": 157.99, "39-43": 187.64, "44-48": 243.93, "49-53": 317.11, "54-58": 412.24, "59+": 594.17,
};

export const SBC_MEI_PARCIAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_PARCIAL,
  "basic-referencia": SHARED_BASIC_REF,
  "smart-ambulatorial": SHARED_SMART_AMB_PARCIAL,
  "smart-200": SBC_S200_PARCIAL,
  "smart-200-up": SHARED_S200UP_PARCIAL,
  "smart-300": SHARED_S300_PARCIAL,
  "smart-500-enf": SHARED_S500_ENF_PARCIAL,
  "smart-500-apt": SHARED_S500_APT_PARCIAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_PARCIAL,
  "smart-prime-apt": SHARED_SPRIME_APT_PARCIAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_PARCIAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_PARCIAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_PARCIAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_PARCIAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_PARCIAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_PARCIAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_PARCIAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_PARCIAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_PARCIAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_PARCIAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_PARCIAL,
};

export const SBC_MEI_TOTAL: Record<string, PriceTable> = {
  "nosso-medico": SHARED_NOSSO_MEDICO_TOTAL,
  "smart-ambulatorial": SHARED_SMART_AMB_TOTAL,
  "smart-150-abc": SBC_S150_ABC_TOTAL,
  "smart-200": SBC_S200_TOTAL,
  "smart-200-up": SHARED_S200UP_TOTAL,
  "smart-300": SHARED_S300_TOTAL,
  "smart-500-enf": SHARED_S500_ENF_TOTAL,
  "smart-500-apt": SHARED_S500_APT_TOTAL,
  "smart-prime-enf": SHARED_SPRIME_ENF_TOTAL,
  "smart-prime-apt": SHARED_SPRIME_APT_TOTAL,
  "advance-600-enf-total": SHARED_ADV600_ENF_TOTAL_TOTAL,
  "advance-600-apt-total": SHARED_ADV600_APT_TOTAL_TOTAL,
  "advance-700-enf-total": SHARED_ADV700_ENF_TOTAL_TOTAL,
  "advance-700-apt-total": SHARED_ADV700_APT_TOTAL_TOTAL,
  "premium-900-care-apt-total": SHARED_PREMCARE_APT_TOTAL_TOTAL,
  "premium-900-apt-total": SHARED_PREM900_APT_TOTAL_TOTAL,
  "advance-600-enf-parcial": SHARED_ADV600_ENF_PARCIAL_TOTAL,
  "advance-600-apt-parcial": SHARED_ADV600_APT_PARCIAL_TOTAL,
  "advance-700-enf-parcial": SHARED_ADV700_ENF_PARCIAL_TOTAL,
  "advance-700-apt-parcial": SHARED_ADV700_APT_PARCIAL_TOTAL,
  "premium-900-care-apt-parcial": SHARED_PREMCARE_APT_PARCIAL_TOTAL,
};
