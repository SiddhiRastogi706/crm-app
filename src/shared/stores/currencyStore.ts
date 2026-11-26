import { create } from 'zustand';

export type Currency = 'INR' | 'USD';

interface CurrencyState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  format: (amount: number) => string;
}

const getStoredCurrency = (): Currency => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kcis_crm_currency', 'INR');
  }
  return 'INR'; // Strictly locked to INR for KCIS Info Solution
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: getStoredCurrency(),
  setCurrency: (currency: Currency) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kcis_crm_currency', currency);
      window.dispatchEvent(new CustomEvent('kcis:currency-changed', { detail: currency }));
    }
    set({ currency });
  },
  toggleCurrency: () => {
    const next = get().currency === 'INR' ? 'USD' : 'INR';
    get().setCurrency(next);
  },
  format: (amount: number) => {
    const curr = get().currency;
    const locale = curr === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 0,
    }).format(amount);
  },
}));
