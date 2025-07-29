// Exemplo de como usar os dados de exemplo em um componente

import { useIrisData } from '@/hooks/useIrisData';
import { useResources } from '@/hooks/useResources';
import { generateSampleDataForResource } from '@/utils/sampleData';

export const ExampleUsage = () => {
  const { hasData, generateDataForType, regenerateAllData } = useIrisData();
  const { resources, createResourcesBatch } = useResources();

  // Exemplo 1: Gerar dados para um tipo específico
  const handleGenerateWaterData = () => {
    generateDataForType('water', 12); // 12 meses de dados de água
  };

  // Exemplo 2: Usar a função diretamente
  const handleGenerateCustomData = () => {
    const customData = generateSampleDataForResource('energy', 6);
    createResourcesBatch(customData);
  };

  // Exemplo 3: Regenerar todos os dados
  const handleRegenerateAll = () => {
    regenerateAllData();
  };

  return (
    <div>
      <p>Total de registros: {resources.length}</p>
      <button onClick={handleGenerateWaterData}>
        Gerar Dados de Água (12 meses)
      </button>
      <button onClick={handleGenerateCustomData}>
        Gerar Dados de Energia (6 meses)
      </button>
      <button onClick={handleRegenerateAll}>
        Regenerar Todos os Dados
      </button>
    </div>
  );
};
