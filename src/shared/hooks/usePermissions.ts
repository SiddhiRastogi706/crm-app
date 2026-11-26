import { useAuthStore } from '@/features/auth/stores/authStore';
import { Role } from '@/lib/api/types';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || 'sales_rep';

  const isAdmin = role === 'admin';
  const isTechnical = role === 'technical' || role === 'manager';
  const isManager = isTechnical || isAdmin;
  const isSalesRep = role === 'sales_rep';

  const canManageUsers = isAdmin;
  const canAccessSettings = true;
  const canManageAutomations = true;
  const canViewReports = true;
  const canAssignLeads = isAdmin || isSalesRep;
  const canDeleteContacts = isAdmin || isSalesRep;
  const canDeleteDeals = isAdmin || isSalesRep;
  const canCreateCampaigns = isAdmin || isTechnical;

  const hasRole = (allowedRoles: Role[]) => {
    return allowedRoles.includes(role);
  };

  return {
    role,
    user,
    isAdmin,
    isTechnical,
    isManager,
    isSalesRep,
    canManageUsers,
    canAccessSettings,
    canManageAutomations,
    canViewReports,
    canAssignLeads,
    canDeleteContacts,
    canDeleteDeals,
    canCreateCampaigns,
    hasRole,
  };
}
