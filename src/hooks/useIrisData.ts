import { useEffect } from 'react';
import { useResources } from './useResources';
import { ResourceRecord } from '@/types/iris';
import { generateSampleData, generateSampleDataForResource } from '@/utils/sampleData';

// Hook para inicializar dados de exemplo se necessário
export const useIrisData = () => {
  const { resources, createResourcesBatch } = useResources();

  useEffect(() => {
    // Se não há dados, criar dados simulados de 12 meses
    if (resources.length === 0) {
      const sampleData = generateSampleData();
      createResourcesBatch(sampleData);
    }
  }, [resources.length, createResourcesBatch]);

  // Função para gerar dados específicos de um tipo de recurso
  const generateDataForType = (type: ResourceRecord['type'], monthsBack: number = 6) => {
    const sampleData = generateSampleDataForResource(type, monthsBack);
    createResourcesBatch(sampleData);
  };

  // Função para limpar dados existentes e gerar novos
  const regenerateAllData = () => {
    // Esta função pode ser usada para resetar e gerar novos dados
    const sampleData = generateSampleData();
    createResourcesBatch(sampleData);
  };

  return { 
    hasData: resources.length > 0,
    generateDataForType,
    regenerateAllData
  };
};