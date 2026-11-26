import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, DollarSign, LifeBuoy, ArrowRight, X, LayoutDashboard, CheckSquare, Zap, BarChart2 } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { Input } from './input';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { apiClient } from '@/lib/api/axios';
import { Contact, Deal, Ticket } from '@/lib/api/types';
import { Badge } from './badge';
import { formatCurrency } from '@/utils/formatters';

interface SearchResults {
  contacts: Contact[];
  deals: Deal[];
  tickets: Ticket[];
}

export const CommandMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ contacts: [], deals: [], tickets: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 200);

  // Toggle with Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ contacts: [], deals: [], tickets: [] });
      return;
    }

    setLoading(true);
    apiClient
      .get<SearchResults>(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`)
      .then((res) => setResults(res.data))
      .catch(() => setResults({ contacts: [], deals: [], tickets: [] }))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery('');
    navigate(url);
  };

  const hasResults =
    results.contacts.length > 0 || results.deals.length > 0 || results.tickets.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden shadow-2xl rounded-xl border-border">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
          <input
            className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground"
            placeholder="Search contacts, deals, tickets, or type a page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-muted-foreground hover:text-foreground px-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Scrollable list of results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {loading && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Searching Pulse CRM...
            </div>
          )}

          {!loading && !query && (
            <div className="space-y-1">
              <p className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Navigation
              </p>
              <div
                onClick={() => handleSelect('/dashboard')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>Dashboard Overview</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <div
                onClick={() => handleSelect('/deals')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span>Deals Kanban Board</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <div
                onClick={() => handleSelect('/contacts')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>Contacts Directory</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <div
                onClick={() => handleSelect('/tasks')}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-amber-600" />
                  <span>Tasks & Calendar</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          )}

          {!loading && query && !hasResults && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Contacts Section */}
          {results.contacts.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Contacts
              </p>
              {results.contacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelect(`/contacts/${c.id}`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-semibold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.company} • {c.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Deals Section */}
          {results.deals.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Deals
              </p>
              {results.deals.map((d) => (
                <div
                  key={d.id}
                  onClick={() => handleSelect('/deals')}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.company} • {formatCurrency(d.value)}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {d.stage}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Tickets Section */}
          {results.tickets.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Tickets
              </p>
              {results.tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelect('/tickets')}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                      <LifeBuoy className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">{t.ticketNumber} • {t.company}</p>
                    </div>
                  </div>
                  <Badge
                    variant={t.priority === 'urgent' ? 'destructive' : 'outline'}
                    className="text-[10px] uppercase"
                  >
                    {t.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t border-border text-[11px] text-muted-foreground">
          <span>Navigate with <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px]">↓</kbd></span>
          <span>Close with <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px]">Esc</kbd></span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
