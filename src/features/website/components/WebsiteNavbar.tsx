import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useCurrencyStore } from '@/shared/stores/currencyStore';
import { Button } from '@/shared/ui/button';

interface WebsiteNavbarProps {
  onOpenConsultation: () => void;
}

export const WebsiteNavbar: React.FC<WebsiteNavbarProps> = ({ onOpenConsultation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { currency, setCurrency } = useCurrencyStore();
  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur-xl transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Left: Premium Brand Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-50 p-1.5 border border-blue-200/80 shadow-sm group-hover:border-blue-400 group-hover:bg-blue-100/50 transition-all duration-300">
              <img
                src="/kcis-icon.png"
                alt="KCIS Info Solution Pvt Ltd Logo"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                KCIS Info Solution Pvt Ltd
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                We Breathe Technology
              </span>
            </div>
          </Link>

          {/* Center Navigation Links - Clean, Uncluttered Blue & White */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('solutions')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick('amc-tiers')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              AMC & SLAs
            </button>
            <button
              onClick={() => handleNavClick('estimator')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>SLA Estimator</span>
            </button>
            <button
              onClick={() => handleNavClick('partners')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              OEM Alliances
            </button>
          </nav>

          {/* Right Section: CRM PORTAL */}
          <div className="flex items-center gap-3">
            {/* TOP RIGHT CRM PORTAL BUTTON */}
            <Button
              size="sm"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 h-9 sm:h-10 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all flex items-center gap-2 group cursor-pointer border border-blue-400/30"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>CRM Portal</span>
            </Button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-blue-100 bg-white px-5 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('solutions')}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Enterprise Solutions
            </button>
            <button
              onClick={() => handleNavClick('amc-tiers')}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              24x7 AMC & SLA Tiers
            </button>
            <button
              onClick={() => handleNavClick('estimator')}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Infrastructure Cost Estimator
            </button>
            <button
              onClick={() => handleNavClick('partners')}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Technology Partners
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(isAuthenticated ? '/dashboard' : '/login');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center shadow-md shadow-blue-500/20"
            >
              <LogIn className="w-4 h-4 mr-2" />
              CRM Portal
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
