import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from './card';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. +14.2 or -3.1
  changePeriod?: string; // e.g. "vs last month"
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  accentBorderColor?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs last period',
  icon: Icon,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  accentBorderColor = 'border-t-primary',
  prefix,
  suffix,
  className,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="h-full"
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-lg border-t-2 group bg-card',
        accentBorderColor,
        className
      )}>
        {/* Background Ambient Watermark Icon */}
        <div className="absolute -right-3 -bottom-3 text-muted-foreground/5 dark:text-muted-foreground/10 pointer-events-none group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-28 w-28" />
        </div>

        <CardContent className="p-5 relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{title}</p>
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl shadow-2xs group-hover:scale-105 transition-transform', iconBgColor)}>
              <Icon className={cn('h-4 w-4', iconColor)} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            {prefix && <span className="text-2xl font-bold tracking-tight text-foreground">{prefix}</span>}
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
          </div>

          {change !== undefined && (
            <div className="mt-3 flex items-center text-xs">
              <span
                className={cn(
                  'inline-flex items-center font-bold px-2 py-0.5 rounded-full mr-2 text-[11px]',
                  isPositive && 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
                  isNegative && 'bg-rose-100/80 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
                  isNeutral && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                )}
              >
                {isPositive && <TrendingUp className="h-3 w-3 mr-1 inline" />}
                {isNegative && <TrendingDown className="h-3 w-3 mr-1 inline" />}
                {isNeutral && <Minus className="h-3 w-3 mr-1 inline" />}
                {isPositive ? `+${change}%` : `${change}%`}
              </span>
              <span className="text-muted-foreground font-medium text-[11px]">{changePeriod}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
