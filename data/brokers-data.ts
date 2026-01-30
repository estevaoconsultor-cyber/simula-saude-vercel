// Dados de corretores e gestores Hapvida
// Total: 11807 corretores

export interface Broker {
  cnpj: string;
  code: string;
  name: string;
  manager: string;
}

// Dados dos gestores com contato
export interface Manager {
  name: string;
  role: string;
  whatsapp: string;
  email: string;
  photo?: string;
  teamId?: string; // ID da equipe (gerente sênior)
}

// Estrutura de equipe com gerente sênior e gestores
export interface Team {
  id: string;
  senior: Manager;
  members: Manager[];
}

// Equipes organizadas por gerente sênior
export const TEAMS: Team[] = [
  // Equipe 1 - Camila Foiadelli
  {
    id: "camila-foiadelli",
    senior: {
      name: "Camila Foiadelli",
      role: "Gerente Sênior",
      whatsapp: "5511974916677",
      email: "camila.foiadelli@hapvida.com.br",
    },
    members: [
      {
        name: "Camila Pertinhez",
        role: "Gestora Comercial",
        whatsapp: "5511999797535",
        email: "camila.pertinhez@hapvida.com.br",
        teamId: "camila-foiadelli",
      },
      {
        name: "Wilder Patzi",
        role: "Gestor Comercial",
        whatsapp: "5511998671451",
        email: "wilder.patzi@hapvida.com.br",
        teamId: "camila-foiadelli",
      },
      {
        name: "Patricia Monks",
        role: "Gestora Comercial",
        whatsapp: "5511970985357",
        email: "patricia.monks@hapvida.com.br",
        teamId: "camila-foiadelli",
      },
      {
        name: "Erika Sousa",
        role: "Gestora Comercial",
        whatsapp: "5511991377651",
        email: "erika.silva2@hapvida.com.br",
        teamId: "camila-foiadelli",
      },
    ],
  },
  // Equipe 2 - Leonardo Dias Mariano
  {
    id: "leonardo-mariano",
    senior: {
      name: "Leonardo Dias Mariano",
      role: "Gerente Sênior",
      whatsapp: "5516991658514",
      email: "leonardo.mariano@hapvida.com.br",
    },
    members: [
      {
        name: "Izabelle Laurentino",
        role: "Gestora Comercial",
        whatsapp: "5511996146337",
        email: "izabele.oliveira@hapvida.com.br",
        teamId: "leonardo-mariano",
      },
      {
        name: "Vivian Ambrósio",
        role: "Gestora Comercial",
        whatsapp: "5511930498970",
        email: "vivian.ambrosio@hapvida.com.br",
        teamId: "leonardo-mariano",
      },
    ],
  },
  // Equipe 3 - Estevão Cardoso
  {
    id: "estevao-cardoso",
    senior: {
      name: "Estevão Cardoso",
      role: "Gerente Sênior",
      whatsapp: "5584998009598",
      email: "estevao.cardoso@hapvida.com.br",
    },
    members: [
      {
        name: "Laís Martins",
        role: "Executiva Comercial",
        whatsapp: "5511998752193",
        email: "lais.martins@hapvida.com.br",
        teamId: "estevao-cardoso",
      },
      {
        name: "Pablo Amora",
        role: "Executivo Comercial",
        whatsapp: "5511913660795",
        email: "pablo.amora@hapvida.com.br",
        teamId: "estevao-cardoso",
      },
      {
        name: "Jonathan Leal",
        role: "Executivo Comercial III",
        whatsapp: "5511972498842",
        email: "jonathan.lsilva@hapvida.com.br",
        teamId: "estevao-cardoso",
      },
      {
        name: "Agatha Sakamoto",
        role: "Executiva Comercial",
        whatsapp: "5511973473826",
        email: "agatha.sakamoto@hapvida.com.br",
        teamId: "estevao-cardoso",
      },
    ],
  },
  // Equipe 4 - Marcelo Lima
  {
    id: "marcelo-lima",
    senior: {
      name: "Marcelo Lima",
      role: "Gerente Sênior",
      whatsapp: "5585986663947",
      email: "marcelo.alima@hapvida.com.br",
    },
    members: [
      {
        name: "Daniela Novais",
        role: "Gestora Comercial",
        whatsapp: "5511973593725",
        email: "daniela.nsantos@hapvida.com.br",
        teamId: "marcelo-lima",
      },
      {
        name: "Daniela Frederico",
        role: "Gestora Comercial",
        whatsapp: "5511996299655",
        email: "daniela.fmartins@hapvida.com.br",
        teamId: "marcelo-lima",
      },
      {
        name: "Guilherme Musachi",
        role: "Gestor Comercial",
        whatsapp: "5511911467505",
        email: "guilherme.musachi@hapvida.com.br",
        teamId: "marcelo-lima",
      },
      {
        name: "Karol Lopes",
        role: "Gestora Comercial",
        whatsapp: "5511942045449",
        email: "karollainny.lopes@hapvida.com.br",
        teamId: "marcelo-lima",
      },
    ],
  },
  // Equipe 5 - Maria Aparecida
  {
    id: "maria-aparecida",
    senior: {
      name: "Maria Aparecida",
      role: "Gerente Sênior",
      whatsapp: "5564992090333",
      email: "maria.acabral@hapvida.com.br",
    },
    members: [
      {
        name: "Flavia Auana",
        role: "Gestora Comercial",
        whatsapp: "5515996812053",
        email: "flavia.auana@hapvida.com.br",
        teamId: "maria-aparecida",
      },
      {
        name: "Kaique Araújo",
        role: "Gestor Comercial",
        whatsapp: "5511998633709",
        email: "kaique.asilva@hapvida.com.br",
        teamId: "maria-aparecida",
      },
    ],
  },
];

// Lista plana de todos os managers (para compatibilidade)
export const MANAGERS: Manager[] = TEAMS.flatMap(team => [
  { ...team.senior, teamId: team.id },
  ...team.members
]);

// Lista compacta de corretores: [cnpj, código, razão social, gestor]
type CompactBroker = [string, string, string, string];

const BROKERS_DATA: CompactBroker[] = [
  // Dados serão preenchidos posteriormente
  // Formato: [CNPJ, Código Hapvida, Razão Social, Nome do Gestor]
];

// Função para buscar corretor por CNPJ, código ou nome
export function searchBroker(query: string): Broker[] {
  const normalizedQuery = query.toLowerCase().replace(/[.\-\/]/g, "");
  
  return BROKERS_DATA
    .filter(([cnpj, code, name]) => {
      const normalizedCnpj = cnpj.replace(/[.\-\/]/g, "").toLowerCase();
      const normalizedCode = code.toLowerCase();
      const normalizedName = name.toLowerCase();
      
      return (
        normalizedCnpj.includes(normalizedQuery) ||
        normalizedCode.includes(normalizedQuery) ||
        normalizedName.includes(normalizedQuery)
      );
    })
    .slice(0, 20)
    .map(([cnpj, code, name, manager]) => ({
      cnpj,
      code,
      name,
      manager,
    }));
}

// Função para obter contato do gestor pelo nome
export function getManagerContact(managerName: string): Manager | undefined {
  return MANAGERS.find(
    (m) => m.name.toLowerCase() === managerName.toLowerCase()
  );
}

// Função para obter equipe pelo ID
export function getTeamById(teamId: string): Team | undefined {
  return TEAMS.find(t => t.id === teamId);
}

// Função para obter equipe pelo nome do gerente sênior
export function getTeamBySeniorName(seniorName: string): Team | undefined {
  return TEAMS.find(
    t => t.senior.name.toLowerCase() === seniorName.toLowerCase()
  );
}
