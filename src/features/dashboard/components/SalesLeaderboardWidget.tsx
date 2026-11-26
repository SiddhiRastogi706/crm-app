import React from 'react';
import { Trophy, Award, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { formatCurrency } from '@/utils/formatters';

interface SalesRepPerformance {
  id: string;
  name: string;
  role: string;
  target: number;
  closed: number;
  dealsWon: number;
  conversionRate: number;
  badge: string;
  avatar: string;
}

export const SalesLeaderboardWidget: React.FC = () => {
  const reps: SalesRepPerformance[] = [
    {
      id: 'rep-1',
      name: 'Emily Chen',
      role: 'Enterprise Sales Lead',
      target: 250000,
      closed: 285000,
      dealsWon: 8,
      conversionRate: 64,
      badge: '🏆 Top Closer of Month',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'rep-2',
      name: 'Sam Rivera',
      role: 'Cloud & License Specialist',
      target: 200000,
      closed: 195000,
      dealsWon: 6,
      conversionRate: 58,
      badge: '⚡ Fast Pipeline Velocity',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'rep-3',
      name: 'Jordan Taylor',
      role: 'Technical Solutions Lead',
      target: 150000,
      closed: 142000,
      dealsWon: 5,
      conversionRate: 52,
      badge: '🛡️ AMC & SLA Champion',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">KCIS Sales Leaderboard & Targets</CardTitle>
            <p className="text-[11px] text-muted-foreground">Monthly rep quota achievements & incentives</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 border-emerald-300 bg-emerald-50/50">
          <Sparkles className="h-3 w-3 mr-1 inline" /> Active Q4 Cycle
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {reps.map((rep, idx) => {
          const percent = Math.round((rep.closed / rep.target) * 100);
          const isOverachieved = percent >= 100;

          return (
            <div
              key={rep.id}
              className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={rep.avatar}
                      alt={rep.name}
                      className="h-9 w-9 rounded-full object-cover border-2 border-background shadow-xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center text-white ${
                        idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-foreground">{rep.name}</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-muted text-muted-foreground">
                        {rep.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{rep.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">{formatCurrency(rep.closed)}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Target: {formatCurrency(rep.target)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {rep.dealsWon} Deals Closed ({rep.conversionRate}% win rate)
                  </span>
                  <span className={`font-bold ${isOverachieved ? 'text-emerald-600' : 'text-primary'}`}>
                    {percent}% Achieved
                  </span>
                </div>

                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, percent)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverachieved
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
