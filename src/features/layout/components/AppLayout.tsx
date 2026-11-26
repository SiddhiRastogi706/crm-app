import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CommandMenu } from '@/shared/ui/command-menu';
import { Toaster } from 'sonner';
import { Drawer, DrawerContent } from '@/shared/ui/drawer';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductExpiryBanner } from '@/features/products/components/ProductExpiryBanner';
import { ProductExpiryModal } from '@/features/products/components/ProductExpiryModal';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expiryModalOpen, setExpiryModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setExpiryModalOpen(true);
    window.addEventListener('pulse:open-expiry-modal', handleOpen);
    return () => window.removeEventListener('pulse:open-expiry-modal', handleOpen);
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <DrawerContent side="left" size="sm" className="p-0 max-w-[280px]">
          <Sidebar
            collapsed={false}
            onToggleCollapse={() => {}}
            mobile
            onCloseMobile={() => setMobileDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Global Product Expiry Warning Banner */}
        <ProductExpiryBanner onOpenModal={() => setExpiryModalOpen(true)} />

        <Header onToggleMobileSidebar={() => setMobileDrawerOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>

        <MobileNav onOpenDrawer={() => setMobileDrawerOpen(true)} />
      </div>

      {/* Global Command Palette */}
      <CommandMenu />

      {/* Product Expiry Alert Modal Popup */}
      <ProductExpiryModal
        forceOpen={expiryModalOpen}
        onClose={() => setExpiryModalOpen(false)}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};
