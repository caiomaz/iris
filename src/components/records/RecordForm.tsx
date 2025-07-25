import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceRecord, RESOURCE_CONFIG } from '@/types/iris';
import { useResources } from '@/hooks/useResources';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface RecordFormProps {
  editingRecord?: ResourceRecord;
  onSave?: () => void;
}

export const RecordForm = ({ editingRecord, onSave }: RecordFormProps) => {
  const [type, setType] = useState<ResourceRecord['type']>(editingRecord?.type || 'water');
  const [value, setValue] = useState(editingRecord?.value?.toString() || '');
  const [date, setDate] = useState(editingRecord?.date || format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState(editingRecord?.description || '');

  const { createResource, updateResource } = useResources();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive"
      });
      return;
    }

    const resourceData = {
      type,
      value: Number(value),
      date,
      description,
      unit: RESOURCE_CONFIG[type].unit
    };

    try {
      if (editingRecord) {
        updateResource(editingRecord.id, resourceData);
        toast({
          title: "Sucesso",
          description: "Registro atualizado com sucesso"
        });
      } else {
        createResource(resourceData);
        toast({
          title: "Sucesso", 
          description: "Registro criado com sucesso"
        });
      }

      // Reset form if creating new record
      if (!editingRecord) {
        setValue('');
        setDescription('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
      }
      
      onSave?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar registro",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-card-eco">
      <CardHeader>
        <CardTitle>
          {editingRecord ? 'Editar Registro' : 'Novo Registro'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Recurso</Label>
              <Select value={type} onValueChange={(value) => setType(value as ResourceRecord['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RESOURCE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center space-x-2">
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                Valor ({RESOURCE_CONFIG[type].unit})
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre este registro..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-primary">
            {editingRecord ? 'Atualizar' : 'Criar'} Registro
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};