import { ResourceRecord, RESOURCE_CONFIG } from '@/types/iris';

export const generateSampleData = (): Omit<ResourceRecord, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const data: Omit<ResourceRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const currentDate = new Date();
  
  // Generate data for the last 12 months
  for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthOffset, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Seasonal variations
    const isWinter = month >= 5 && month <= 8; // Jun-Sep (winter in Brazil)
    const isSummer = month >= 11 || month <= 2; // Dec-Mar (summer in Brazil)
    
    // Generate multiple records per month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const recordsPerMonth = Math.floor(Math.random() * 8) + 5; // 5-12 records per month
    
    for (let i = 0; i < recordsPerMonth; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const recordDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Water (m³) - 8-15 m³ per month residential
      const waterBase = 12;
      const waterVariation = isWinter ? 0.8 : isSummer ? 1.3 : 1.0;
      data.push({
        type: 'water',
        value: Math.round((waterBase * waterVariation * (0.8 + Math.random() * 0.4)) * 100) / 100,
        unit: RESOURCE_CONFIG.water.unit,
        date: recordDate,
        description: `Consumo residencial ${isWinter ? '(inverno)' : isSummer ? '(verão)' : '(meia estação)'}`
      });
      
      // Energy (kWh) - 150-400 kWh per month
      const energyBase = 280;
      const energyVariation = isWinter ? 0.7 : isSummer ? 1.4 : 1.0;
      data.push({
        type: 'energy',
        value: Math.round(energyBase * energyVariation * (0.7 + Math.random() * 0.6)),
        unit: RESOURCE_CONFIG.energy.unit,
        date: recordDate,
        description: `Consumo energético ${isSummer ? '(ar condicionado)' : isWinter ? '(aquecimento)' : '(normal)'}`
      });
      
      // Gas (m³) - 8-25 m³ per month
      const gasBase = 15;
      const gasVariation = isWinter ? 1.5 : 0.8;
      data.push({
        type: 'gas',
        value: Math.round((gasBase * gasVariation * (0.6 + Math.random() * 0.8)) * 100) / 100,
        unit: RESOURCE_CONFIG.gas.unit,
        date: recordDate,
        description: `Gás natural ${isWinter ? '(aquecimento)' : '(cozinha)'}`
      });
      
      // Waste (kg) - 20-40 kg per month
      if (Math.random() > 0.3) { // Not every day has waste records
        data.push({
          type: 'waste',
          value: Math.round((3 + Math.random() * 8) * 100) / 100,
          unit: RESOURCE_CONFIG.waste.unit,
          date: recordDate,
          description: 'Resíduos domésticos'
        });
      }
      
      // Compost (kg) - 5-15 kg per month
      if (Math.random() > 0.5) { // Not every day has compost
        data.push({
          type: 'compost',
          value: Math.round((1 + Math.random() * 4) * 100) / 100,
          unit: RESOURCE_CONFIG.compost.unit,
          date: recordDate,
          description: 'Composto orgânico'
        });
      }
    }
  }
  
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const generateSampleDataForResource = (
  type: ResourceRecord['type'], 
  monthsBack: number = 6
): Omit<ResourceRecord, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const data: Omit<ResourceRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const currentDate = new Date();
  
  for (let monthOffset = monthsBack - 1; monthOffset >= 0; monthOffset--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - monthOffset, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate 6 records per month for the specific type
    for (let i = 0; i < 6; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const recordDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      let value: number;
      let description: string;
      
      switch (type) {
        case 'water':
          value = Math.round((8 + Math.random() * 7) * 100) / 100;
          description = 'Consumo de água residencial';
          break;
        case 'energy':
          value = Math.round(150 + Math.random() * 250);
          description = 'Consumo de energia elétrica';
          break;
        case 'gas':
          value = Math.round((8 + Math.random() * 17) * 100) / 100;
          description = 'Consumo de gás natural';
          break;
        case 'waste':
          value = Math.round((2 + Math.random() * 8) * 100) / 100;
          description = 'Resíduos domésticos';
          break;
        case 'compost':
          value = Math.round((1 + Math.random() * 4) * 100) / 100;
          description = 'Composto orgânico';
          break;
      }
      
      data.push({
        type,
        value,
        unit: RESOURCE_CONFIG[type].unit,
        date: recordDate,
        description
      });
    }
  }
  
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
