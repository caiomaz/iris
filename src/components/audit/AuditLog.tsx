import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useResources } from '@/hooks/useResources';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { RESOURCE_CONFIG } from '@/types/iris';

export const AuditLog = () => {
  const { auditLogs } = useResources();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="h-4 w-4" />;
      case 'UPDATE':
        return <Edit className="h-4 w-4" />;
      case 'DELETE':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
    } catch {
      return timestamp;
    }
  };

  const getResourceLabel = (resourceType: string) => {
    return RESOURCE_CONFIG[resourceType as keyof typeof RESOURCE_CONFIG]?.label || resourceType;
  };

  return (
    <Card className="shadow-card-eco">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Log de Auditoria</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Histórico completo de todas as operações realizadas no sistema
        </p>
      </CardHeader>
      <CardContent>
        {auditLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma atividade registrada
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getActionColor(log.action)}
                      >
                        <span className="flex items-center space-x-1">
                          {getActionIcon(log.action)}
                          <span>{log.action}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center space-x-2">
                        <span>
                          {RESOURCE_CONFIG[log.resourceType as keyof typeof RESOURCE_CONFIG]?.icon}
                        </span>
                        <span>{getResourceLabel(log.resourceType)}</span>
                      </span>
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {log.description}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};