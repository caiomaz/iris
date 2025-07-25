import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ResourceRecord, RESOURCE_CONFIG } from '@/types/iris';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResourceChartProps {
  title: string;
  data: ResourceRecord[];
}

export const ResourceChart = ({ title, data }: ResourceChartProps) => {
  const chartData = useMemo(() => {
    // Agrupar dados por data e tipo
    const groupedData = data.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = { date };
      }
      acc[date][record.type] = (acc[date][record.type] || 0) + record.value;
      return acc;
    }, {} as Record<string, any>);

    // Converter para array e ordenar por data
    return Object.values(groupedData)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Últimos 30 registros
  }, [data]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(data.map(r => r.type)));
  }, [data]);

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

  const formatTooltipDate = (date: string) => {
    try {
      return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return date;
    }
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

  return (
    <Card className="shadow-card-eco">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => format(parseISO(date), 'dd/MM')}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(date) => formatTooltipDate(date as string)}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} ${RESOURCE_CONFIG[name as keyof typeof RESOURCE_CONFIG]?.unit || ''}`,
                RESOURCE_CONFIG[name as keyof typeof RESOURCE_CONFIG]?.label || name
              ]}
            />
            {uniqueTypes.map((type) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={getColorForType(type)}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};