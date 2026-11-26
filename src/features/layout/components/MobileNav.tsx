import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, DollarSign, CalendarCheck, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MobileNavProps {
  onOpenDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenDrawer }) => {
  const tabs = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'Deals', path: '/deals', icon: DollarSign },
    { label: 'Tasks', path: '/tasks', icon: CalendarCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="h-5 w-5 mb-0.5" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
      <button
        type="button"
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium text-muted-foreground hover:text-foreground"
      >
        <MoreHorizontal className="h-5 w-5 mb-0.5" />
        <span>Menu</span>
      </button>
    </nav>
  );
};
