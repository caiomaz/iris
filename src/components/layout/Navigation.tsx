import { Button } from '@/components/ui/button';
import { BarChart3, FileText, ClipboardList, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'records', label: 'Registros', icon: ClipboardList },
    { id: 'audit', label: 'Auditoria', icon: FileText },
    { id: 'analytics', label: 'Análises', icon: Activity }
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "flex items-center space-x-2 rounded-none border-b-2 border-transparent",
                  activeTab === item.id && "border-primary"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};