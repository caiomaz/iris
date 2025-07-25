import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const LoginForm = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao IRIS Dashboard!",
          variant: "default"
        });
      } else {
        toast({
          title: "Erro de autenticação",
          description: result.error || "Credenciais inválidas",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro durante o login",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-eco flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-eco">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-gradient-primary p-4 rounded-full w-16 h-16 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">IRIS</CardTitle>
            <p className="text-muted-foreground mt-2">
              Indicadores de Recursos, Impacto e Sustentabilidade
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Usuário</span>
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Senha</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-accent rounded-lg">
            <p className="text-sm text-accent-foreground text-center">
              <strong>Demo:</strong> usuário: admin | senha: admin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};