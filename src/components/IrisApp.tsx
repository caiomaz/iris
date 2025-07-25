import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIrisData } from '@/hooks/useIrisData';
import { LoginForm } from './auth/LoginForm';
import { Header } from './layout/Header';
import { Navigation } from './layout/Navigation';
import { Dashboard } from './dashboard/Dashboard';
import { RecordsManagement } from './records/RecordsManagement';
import { AuditLog } from './audit/AuditLog';
import { Analytics } from './analytics/Analytics';

export const IrisApp = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Inicializar dados de exemplo se necessário (só quando autenticado)
  useIrisData();

  // Reset tab quando logout
  useEffect(() => {
    if (!isAuthenticated) {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-eco flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Authenticated - show main app
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'records':
        return <RecordsManagement />;
      case 'audit':
        return <AuditLog />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};