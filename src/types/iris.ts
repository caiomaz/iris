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
    unit: 'L',
    color: 'water',
    icon: '💧'
  },
  energy: {
    label: 'Energia',
    unit: 'kWh',
    color: 'energy',
    icon: '⚡'
  },
  gas: {
    label: 'Gás',
    unit: 'm³',
    color: 'gas',
    icon: '🔥'
  },
  waste: {
    label: 'Resíduos',
    unit: 'kg',
    color: 'waste',
    icon: '🗑️'
  },
  compost: {
    label: 'Composto',
    unit: 'kg',
    color: 'compost',
    icon: '🌱'
  }
} as const;