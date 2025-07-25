import { useEffect } from 'react';
import { useResources } from './useResources';
import { ResourceRecord } from '@/types/iris';

// Hook para inicializar dados de exemplo se necessário
export const useIrisData = () => {
  const { resources, createResource } = useResources();

  useEffect(() => {
    // Se não há dados, criar alguns exemplos para demonstração
    if (resources.length === 0) {
      const sampleData: Omit<ResourceRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          type: 'water',
          value: 250,
          unit: 'L',
          date: '2024-07-20',
          description: 'Consumo residencial diário'
        },
        {
          type: 'energy',
          value: 15.5,
          unit: 'kWh',
          date: '2024-07-20',
          description: 'Consumo energético do escritório'
        },
        {
          type: 'gas',
          value: 2.3,
          unit: 'm³',
          date: '2024-07-19',
          description: 'Gás natural - cozinha'
        },
        {
          type: 'waste',
          value: 5.2,
          unit: 'kg',
          date: '2024-07-18',
          description: 'Resíduos orgânicos'
        },
        {
          type: 'compost',
          value: 3.1,
          unit: 'kg',
          date: '2024-07-17',
          description: 'Composto gerado no jardim'
        },
        {
          type: 'water',
          value: 280,
          unit: 'L',
          date: '2024-07-15',
          description: 'Consumo elevado - lavagem de roupas'
        },
        {
          type: 'energy',
          value: 18.2,
          unit: 'kWh',
          date: '2024-07-14',
          description: 'Uso intenso de ar condicionado'
        }
      ];

      // Criar dados de exemplo com delay para demonstrar funcionalidade
      sampleData.forEach((data, index) => {
        setTimeout(() => {
          createResource(data);
        }, index * 100);
      });
    }
  }, [resources.length, createResource]);

  return { hasData: resources.length > 0 };
};