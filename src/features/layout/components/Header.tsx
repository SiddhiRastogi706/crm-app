import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, Command, Globe } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Breadcrumbs } from './Breadcrumbs';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { Badge } from '@/shared/ui/badge';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { role } = usePermissions();

  const handleOpenSearch = () => {
    // Dispatch Ctrl+K event
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search trigger button */}
        <button
          onClick={handleOpenSearch}
          className="flex items-center gap-2 h-8 px-3 rounded-lg border border-input bg-muted/40 hover:bg-muted text-xs text-muted-foreground transition-all duration-150 w-32 sm:w-56 justify-between group"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Search className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline">Search CRM...</span>
            <span className="sm:hidden">Search...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Link to Public KCIS Website */}
        <Link
          to="/"
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-red-600 dark:hover:text-red-400 rounded-lg border border-border/80 hover:bg-red-500/5 transition-colors"
          title="Visit Public KCIS Corporate Website"
        >
          <Globe className="h-3.5 w-3.5 text-red-500" />
          <span>KCIS Website</span>
        </Link>

        {/* Role Badge */}
        <Badge
          variant="secondary"
          className="hidden lg:inline-flex text-[11px] font-semibold capitalize bg-primary/10 text-primary border-primary/20"
        >
          {role === 'manager' || role === 'technical' ? 'Technical' : role === 'sales_rep' ? 'Sales Rep' : 'Admin'}
        </Badge>

        <ThemeToggle />
        <NotificationsDropdown />
        <div className="h-4 w-px bg-border mx-1" />
        <UserMenu />
      </div>
    </header>
  );
};
