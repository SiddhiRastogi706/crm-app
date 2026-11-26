import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
