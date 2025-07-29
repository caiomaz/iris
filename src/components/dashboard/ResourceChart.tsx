import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ResourceRecord, RESOURCE_CONFIG } from '@/types/iris';
import { useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResourceChartProps {
  title: string;
  data: ResourceRecord[];
  types: ResourceRecord['type'][];
  chartType?: 'line' | 'bar';
}

export const ResourceChart = ({ title, data, types, chartType = 'line' }: ResourceChartProps) => {
  const chartData = useMemo(() => {
    // Agrupar dados por mês
    const monthlyData = data
      .filter(record => types.includes(record.type))
      .reduce((acc, record) => {
        const date = parseISO(record.date);
        const monthKey = format(startOfMonth(date), 'yyyy-MM');
        const monthLabel = format(startOfMonth(date), 'MMM/yyyy', { locale: ptBR });
        
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthLabel, date: monthKey };
        }
        
        acc[monthKey][record.type] = (acc[monthKey][record.type] || 0) + record.value;
        return acc;
      }, {} as Record<string, any>);

    // Converter para array e ordenar por data
    return Object.values(monthlyData)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-12); // Últimos 12 meses
  }, [data, types]);

  const getColorForType = (type: string) => {
    const colors = {
      water: '#3b82f6',
      energy: '#f59e0b',
      gas: '#ef4444',
      waste: '#dc2626',
      compost: '#22c55e'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const formatTooltipValue = (value: number, type: string) => {
    const config = RESOURCE_CONFIG[type as keyof typeof RESOURCE_CONFIG];
    return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${config?.unit || ''}`;
  };

  if (chartData.length === 0) {
    return (
      <Card className="shadow-card-eco">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart;

  return (
    <Card className="shadow-card-eco">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatTooltipValue(value, name),
                RESOURCE_CONFIG[name as keyof typeof RESOURCE_CONFIG]?.label || name
              ]}
            />
            {types.map((type) => (
              chartType === 'bar' ? (
                <Bar
                  key={type}
                  dataKey={type}
                  fill={getColorForType(type)}
                  name={type}
                />
              ) : (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={getColorForType(type)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                  name={type}
                />
              )
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};