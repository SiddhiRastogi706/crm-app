import React from 'react';
import { useCurrencyStore } from '@/shared/stores/currencyStore';
import { Button } from '@/shared/ui/button';

export const CurrencyToggle: React.FC = () => {
  const { currency, toggleCurrency } = useCurrencyStore();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleCurrency}
      className="h-8 px-2.5 text-xs font-semibold rounded-lg border-border hover:bg-accent/60 gap-1.5 transition-all"
      title={`Switch to ${currency === 'INR' ? 'USD ($)' : 'INR (₹)'}`}
    >
      <span className={currency === 'INR' ? 'text-emerald-600 font-bold' : 'text-muted-foreground'}>₹ INR</span>
      <span className="text-muted-foreground/40">|</span>
      <span className={currency === 'USD' ? 'text-primary font-bold' : 'text-muted-foreground'}>$ USD</span>
    </Button>
  );
};
