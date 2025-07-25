import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RESOURCE_CONFIG } from '@/types/iris';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  type: keyof typeof RESOURCE_CONFIG;
  current: number;
  previous: number;
  total: number;
}

export const StatsCard = ({ type, current, previous, total }: StatsCardProps) => {
  const config = RESOURCE_CONFIG[type];
  const change = current - previous;
  const changePercent = previous > 0 ? (change / previous) * 100 : 0;
  
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-primary" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };
  
  const getTrendColor = () => {
    if (change > 0) return 'text-destructive';
    if (change < 0) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <Card className="shadow-card-eco hover:shadow-eco transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span className="text-lg">{config.icon}</span>
            <span>{config.label}</span>
          </span>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {current.toLocaleString()} {config.unit}
          </div>
          <div className="text-sm text-muted-foreground">
            Este mês vs mês anterior
          </div>
          <div className={`text-sm font-medium ${getTrendColor()}`}>
            {change > 0 ? '+' : ''}{change.toLocaleString()} {config.unit}
            {changePercent !== 0 && (
              <span className="ml-1">
                ({change > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Total acumulado: {total.toLocaleString()} {config.unit}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};