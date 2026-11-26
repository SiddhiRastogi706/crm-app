import React from 'react';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Role } from '@/lib/api/types';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useNavigate } from 'react-router-dom';

interface RoleGateProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children }) => {
  const { hasRole, role } = usePermissions();
  const navigate = useNavigate();

  if (!hasRole(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            This module requires <strong className="text-foreground">{allowedRoles.join(' or ')}</strong> privileges.
            Your current role is <strong className="text-foreground">{role.replace('_', ' ')}</strong>.
          </p>
        </div>
        <div className="pt-2">
          <Button onClick={() => navigate('/dashboard')} size="sm">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
