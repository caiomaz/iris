export interface ResourceRecord {
  id: string;
  type: 'water' | 'energy' | 'gas' | 'waste' | 'compost';
  value: number;
  unit: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  resourceId: string;
  resourceType: string;
  oldValues?: Partial<ResourceRecord>;
  newValues?: Partial<ResourceRecord>;
  timestamp: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalWater: number;
  totalEnergy: number;
  totalGas: number;
  totalWaste: number;
  totalCompost: number;
  currentMonth: {
    water: number;
    energy: number;
    gas: number;
    waste: number;
    compost: number;
  };
  lastMonth: {
    water: number;
    energy: number;
    gas: number;
    waste: number;
    compost: number;
  };
}

export const RESOURCE_CONFIG = {
  water: {
    label: 'Água',
    unit: 'm³',
    color: '#1151a0ff',
    icon: '💧'
  },
  energy: {
    label: 'Energia',
    unit: 'kWh',
    color: '#ffbc13ff',
    icon: '⚡'
  },
  gas: {
    label: 'Gás',
    unit: 'm³',
    color: '#ff2344ff',
    icon: '🔥'
  },
  waste: {
    label: 'Resíduos',
    unit: 'kg',
    color: '#8a006cff',
    icon: '🗑️'
  },
  compost: {
    label: 'Composto',
    unit: 'kg',
    color: '#006e12ff',
    icon: '🌱'
  }
} as const;