import { StatsCard } from './StatsCard';
import { ResourceChart } from './ResourceChart';
import { useResources } from '@/hooks/useResources';
import { RESOURCE_CONFIG } from '@/types/iris';
import { useMemo } from 'react';

export const Dashboard = () => {
  const { resources, loading, error } = useResources();

  const stats = useMemo(() => {
    if (!resources || resources.length === 0) {
      return {
        water: { current: 0, previous: 0, total: 0 },
        energy: { current: 0, previous: 0, total: 0 },
        gas: { current: 0, previous: 0, total: 0 },
        waste: { current: 0, previous: 0, total: 0 },
        compost: { current: 0, previous: 0, total: 0 }
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const getStatsForType = (type: keyof typeof RESOURCE_CONFIG) => {
      const typeRecords = resources.filter(r => r.type === type);
      
      const current = typeRecords
        .filter(r => {
          const date = new Date(r.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, r) => sum + r.value, 0);

      const previous = typeRecords
        .filter(r => {
          const date = new Date(r.date);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        })
        .reduce((sum, r) => sum + r.value, 0);

      const total = typeRecords.reduce((sum, r) => sum + r.value, 0);

      return { current, previous, total };
    };

    return {
      water: getStatsForType('water'),
      energy: getStatsForType('energy'),
      gas: getStatsForType('gas'),
      waste: getStatsForType('waste'),
      compost: getStatsForType('compost')
    };
  }, [resources]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Erro ao carregar dados: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.entries(stats).map(([type, data]) => (
          <StatsCard
            key={type}
            type={type as keyof typeof RESOURCE_CONFIG}
            current={data.current}
            previous={data.previous}
            total={data.total}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceChart 
          title="Consumo de Água (m³)"
          data={resources}
          types={['water']}
          chartType="bar"
        />
        <ResourceChart 
          title="Consumo de Energia (kWh)"
          data={resources}
          types={['energy']}
          chartType="line"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceChart 
          title="Consumo de Gás (m³)"
          data={resources}
          types={['gas']}
          chartType="line"
        />
        <ResourceChart 
          title="Resíduos e Composto (kg)"
          data={resources}
          types={['waste', 'compost']}
          chartType="bar"
        />
      </div>
    </div>
  );
};