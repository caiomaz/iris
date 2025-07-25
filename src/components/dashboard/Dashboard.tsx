import { StatsCard } from './StatsCard';
import { ResourceChart } from './ResourceChart';
import { useResources } from '@/hooks/useResources';
import { RESOURCE_CONFIG } from '@/types/iris';
import { useMemo } from 'react';

export const Dashboard = () => {
  const { resources } = useResources();

  const stats = useMemo(() => {
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
          title="Consumo de Recursos"
          data={resources.filter(r => ['water', 'energy', 'gas'].includes(r.type))}
        />
        <ResourceChart 
          title="Geração de Resíduos e Composto"
          data={resources.filter(r => ['waste', 'compost'].includes(r.type))}
        />
      </div>
    </div>
  );
};