import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  DollarSign,
  PackageCheck,
  CalendarCheck,
  LifeBuoy,
  Megaphone,
  Zap,
  BarChart3,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobile = false,
  onCloseMobile,
}) => {
  const { role, isAdmin } = usePermissions();
  const location = useLocation();

  const isTechnical = role === 'technical' || role === 'manager';
  const isSalesRep = role === 'sales_rep';

  // Role-Based Navigation Items
  // Admin: Everything
  // Sales: Dashboard, Contacts, Leads, Deals Pipeline, Tasks & Calendar, Automations, Reports, Settings
  // Technical: Dashboard, Products & Licenses, Tasks & Calendar, Support Tickets, Marketing, Automations, Reports, Settings
  const navItems = [
    {
      group: 'Core',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ...(!isTechnical ? [{ label: 'Contacts', path: '/contacts', icon: Users }] : []),
        ...(!isTechnical ? [{ label: 'Leads', path: '/leads', icon: Target }] : []),
        ...(!isTechnical ? [{ label: 'Deals Pipeline', path: '/deals', icon: DollarSign }] : []),
        ...(!isSalesRep ? [{ label: 'Products & Licenses', path: '/products', icon: PackageCheck }] : []),
        { label: 'Tasks & Calendar', path: '/tasks', icon: CalendarCheck },
      ],
    },
    ...(!isSalesRep
      ? [
          {
            group: 'Operations',
            items: [
              { label: 'Support Tickets', path: '/tickets', icon: LifeBuoy },
              { label: 'Marketing', path: '/marketing', icon: Megaphone },
            ],
          },
        ]
      : []),
    {
      group: 'Intelligence',
      items: [
        { label: 'Automations', path: '/automation', icon: Zap },
        { label: 'Reports', path: '/reports', icon: BarChart3 },
      ],
    },
  ];

  const adminItems = [
    ...(isAdmin ? [{ label: 'User Management', path: '/users', icon: UserCog }] : []),
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const renderLink = (item: { label: string; path: string; icon: any }) => {
    const Icon = item.icon;
    const isActive = location.pathname.startsWith(item.path);

    const linkContent = (
      <NavLink
        to={item.path}
        onClick={mobile ? onCloseMobile : undefined}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/30'
            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
        )}
      >
        <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
        {(!collapsed || mobile) && <span className="truncate">{item.label}</span>}
      </NavLink>
    );

    if (collapsed && !mobile) {
      return (
        <TooltipProvider key={item.path} delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.path}>{linkContent}</div>;
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out select-none',
        mobile
          ? 'h-full w-64'
          : collapsed
          ? 'w-[68px]'
          : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-border">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden font-bold tracking-tight text-foreground flex-1 min-w-0"
          title="KCIS Info Solution Pvt Ltd - We Breathe Technology"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 border border-border/80 shadow-xs overflow-hidden">
            <img
              src="/kcis-icon.png"
              alt="KCIS Info Solution Pvt Ltd"
              className="h-full w-full object-contain"
            />
          </div>
          {(!collapsed || mobile) && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold leading-tight tracking-tight text-foreground truncate">
                KCIS Info Solution Pvt Ltd
              </span>
              <span className="text-[10px] text-muted-foreground font-medium truncate">
                We Breathe Technology
              </span>
            </div>
          )}
        </NavLink>

        {!mobile && (
          <button
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.group} className="space-y-1">
            {(!collapsed || mobile) && (
              <p className="px-3 text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">{group.items.map(renderLink)}</div>
          </div>
        ))}

        {adminItems.length > 0 && (
          <div className="space-y-1">
            {(!collapsed || mobile) && (
              <p className="px-3 text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                Administration
              </p>
            )}
            <div className="space-y-0.5">{adminItems.map(renderLink)}</div>
          </div>
        )}
      </div>

      {/* Workspace indicator footer */}
      {(!collapsed || mobile) && (
        <div className="p-3 border-t border-border mt-auto">
          <div className="rounded-xl bg-muted/50 p-2.5 border border-border/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Global Instance</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">MSW API Active • 99.9% uptime</p>
            <NavLink
              to="/"
              className="flex items-center justify-between text-[11px] text-muted-foreground hover:text-red-600 dark:hover:text-red-400 font-semibold mt-2 pt-2 border-t border-border/40 transition-colors"
            >
              <span>KCIS Website</span>
              <Globe className="w-3.5 h-3.5 text-red-500" />
            </NavLink>
          </div>
        </div>
      )}
    </aside>
  );
};
