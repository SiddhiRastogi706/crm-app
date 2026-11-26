import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  contacts: 'Contacts',
  leads: 'Leads',
  deals: 'Deals Pipeline',
  tasks: 'Tasks & Calendar',
  tickets: 'Support Tickets',
  marketing: 'Marketing Campaigns',
  automation: 'Automations',
  reports: 'Sales Reports',
  settings: 'Settings',
  users: 'User Management',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = routeNameMap[segment] || segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-medium text-foreground capitalize truncate max-w-[150px]">
                {name}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors capitalize truncate max-w-[120px]"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
