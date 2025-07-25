import { Button } from '@/components/ui/button';
import { LogOut, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
      variant: "default"
    });
  };

  return (
    <header className="bg-gradient-primary text-primary-foreground shadow-eco">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">IRIS</h1>
            <p className="text-sm text-primary-foreground/80">
              Indicadores de Recursos, Impacto e Sustentabilidade
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm">Olá, {user?.username}</span>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};