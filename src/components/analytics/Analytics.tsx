import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResources } from '@/hooks/useResources';
import { RESOURCE_CONFIG } from '@/types/iris';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Analytics = () => {
  const { resources } = useResources();
  const [selectedPeriod, setSelectedPeriod] = useState('6'); // 6 meses

  const analyticsData = useMemo(() => {
    const months = parseInt(selectedPeriod);
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthData = {
        month: format(date, 'MMM/yyyy', { locale: ptBR }),
        ...Object.fromEntries(
          Object.keys(RESOURCE_CONFIG).map(type => [
            type,
            resources
              .filter(r => 
                r.type === type && 
                new Date(r.date) >= monthStart && 
                new Date(r.date) <= monthEnd
              )
              .reduce((sum, r) => sum + r.value, 0)
          ])
        )
      };
      
      data.push(monthData);
    }
    
    return data;
  }, [resources, selectedPeriod]);

  const totalData = useMemo(() => {
    return Object.entries(RESOURCE_CONFIG).map(([type, config]) => ({
      name: config.label,
      value: resources
        .filter(r => r.type === type)
        .reduce((sum, r) => sum + r.value, 0),
      color: `hsl(var(--${config.color}))`
    })).filter(item => item.value > 0);
  }, [resources]);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Análises Avançadas</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card-eco">
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    value.toLocaleString(),
                    RESOURCE_CONFIG[name as keyof typeof RESOURCE_CONFIG]?.label || name
                  ]}
                />
                {Object.entries(RESOURCE_CONFIG).map(([type, config], index) => (
                  <Bar
                    key={type}
                    dataKey={type}
                    fill={COLORS[index % COLORS.length]}
                    name={config.label}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card-eco">
          <CardHeader>
            <CardTitle>Distribuição Total</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={totalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {totalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Total']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card-eco">
        <CardHeader>
          <CardTitle>Resumo Estatístico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(RESOURCE_CONFIG).map(([type, config]) => {
              const typeRecords = resources.filter(r => r.type === type);
              const total = typeRecords.reduce((sum, r) => sum + r.value, 0);
              const average = typeRecords.length > 0 ? total / typeRecords.length : 0;
              const max = Math.max(...typeRecords.map(r => r.value), 0);

              return (
                <div key={type} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{config.icon}</span>
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>Total: {total.toLocaleString()} {config.unit}</div>
                    <div>Média: {average.toFixed(1)} {config.unit}</div>
                    <div>Máximo: {max.toLocaleString()} {config.unit}</div>
                    <div>Registros: {typeRecords.length}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};