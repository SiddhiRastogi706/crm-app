import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Shield, Settings, Check, Code2, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Role } from '@/lib/api/types';
import { toast } from 'sonner';

export const UserMenu: React.FC = () => {
  const { user, logout, switchRole } = useAuthStore();
  const { isAdmin, isManager, isSalesRep } = usePermissions();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleRoleChange = (role: Role) => {
    switchRole(role);
    toast.info(`Switched active role to: ${role.toUpperCase()}`);
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-muted focus:outline-none transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg border-border">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <Badge variant="outline" className="text-[10px] capitalize">
                {user.role === 'technical' || user.role === 'manager' ? 'Technical' : user.role.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Role Switcher for Demo testing */}
        <div className="px-2 py-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Switch Role
          </p>
          <div className="space-y-0.5">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded-md transition-colors ${
                isAdmin ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Shield className="h-3 w-3" /> Admin
              </span>
              {isAdmin && <Check className="h-3 w-3" />}
            </button>
            <button
              onClick={() => handleRoleChange('technical')}
              className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded-md transition-colors ${
                user.role === 'technical' || user.role === 'manager' ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Code2 className="h-3 w-3" /> Technical
              </span>
              {(user.role === 'technical' || user.role === 'manager') && <Check className="h-3 w-3" />}
            </button>
            <button
              onClick={() => handleRoleChange('sales_rep')}
              className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded-md transition-colors ${
                isSalesRep ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="h-3 w-3" /> Sales Rep
              </span>
              {isSalesRep && <Check className="h-3 w-3" />}
            </button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
