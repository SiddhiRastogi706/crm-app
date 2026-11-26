import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGate } from './RoleGate';
import { AppLayout } from '@/features/layout/components/AppLayout';
import { Loader2 } from 'lucide-react';

// Public Corporate Website Landing Page
import { KcisLandingPage } from '@/features/website/pages/KcisLandingPage';

// Core auth entry pages (eagerly loaded for instant first paint)
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';

// Lazy-loaded workspace feature modules (code split)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const ContactsListPage = lazy(() =>
  import('@/features/contacts/pages/ContactsListPage').then((m) => ({ default: m.ContactsListPage }))
);
const ContactDetailPage = lazy(() =>
  import('@/features/contacts/pages/ContactDetailPage').then((m) => ({ default: m.ContactDetailPage }))
);
const LeadsListPage = lazy(() =>
  import('@/features/leads/pages/LeadsListPage').then((m) => ({ default: m.LeadsListPage }))
);
const DealsKanbanPage = lazy(() =>
  import('@/features/deals/pages/DealsKanbanPage').then((m) => ({ default: m.DealsKanbanPage }))
);
const ProductsHistoryPage = lazy(() =>
  import('@/features/products/pages/ProductsHistoryPage').then((m) => ({ default: m.ProductsHistoryPage }))
);
const TasksPage = lazy(() =>
  import('@/features/tasks/pages/TasksPage').then((m) => ({ default: m.TasksPage }))
);
const TicketsPage = lazy(() =>
  import('@/features/tickets/pages/TicketsPage').then((m) => ({ default: m.TicketsPage }))
);
const MarketingPage = lazy(() =>
  import('@/features/marketing/pages/MarketingPage').then((m) => ({ default: m.MarketingPage }))
);
const AutomationPage = lazy(() =>
  import('@/features/automation/pages/AutomationPage').then((m) => ({ default: m.AutomationPage }))
);
const ReportsPage = lazy(() =>
  import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const UserManagementPage = lazy(() =>
  import('@/features/settings/pages/UserManagementPage').then((m) => ({ default: m.UserManagementPage }))
);
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

const PageLoader = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-xs text-muted-foreground font-medium">Loading workspace module...</p>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Corporate Website Landing Page */}
        <Route path="/" element={<KcisLandingPage />} />
        <Route path="/home" element={<KcisLandingPage />} />
        <Route path="/website" element={<KcisLandingPage />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected CRM Workspace App Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="app" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Contacts, Leads, Deals (Visible to Admin & Sales; Hidden from Technical) */}
          <Route
            path="contacts"
            element={
              <RoleGate allowedRoles={['admin', 'sales_rep']}>
                <ContactsListPage />
              </RoleGate>
            }
          />
          <Route
            path="contacts/:id"
            element={
              <RoleGate allowedRoles={['admin', 'sales_rep']}>
                <ContactDetailPage />
              </RoleGate>
            }
          />
          <Route
            path="leads"
            element={
              <RoleGate allowedRoles={['admin', 'sales_rep']}>
                <LeadsListPage />
              </RoleGate>
            }
          />
          <Route
            path="deals"
            element={
              <RoleGate allowedRoles={['admin', 'sales_rep']}>
                <DealsKanbanPage />
              </RoleGate>
            }
          />

          {/* Products & Licenses (Visible to Admin & Technical; Hidden from Sales) */}
          <Route
            path="products"
            element={
              <RoleGate allowedRoles={['admin', 'technical', 'manager']}>
                <ProductsHistoryPage />
              </RoleGate>
            }
          />

          {/* Tasks & Calendar (Visible to All) */}
          <Route path="tasks" element={<TasksPage />} />

          {/* Operations: Tickets & Marketing (Visible to Admin & Technical; Hidden from Sales) */}
          <Route
            path="tickets"
            element={
              <RoleGate allowedRoles={['admin', 'technical', 'manager']}>
                <TicketsPage />
              </RoleGate>
            }
          />
          <Route
            path="marketing"
            element={
              <RoleGate allowedRoles={['admin', 'technical', 'manager']}>
                <MarketingPage />
              </RoleGate>
            }
          />

          {/* Intelligence: Automations & Reports (Visible to All) */}
          <Route path="automation" element={<AutomationPage />} />
          <Route path="reports" element={<ReportsPage />} />

          {/* Admin-Only: User Management */}
          <Route
            path="users"
            element={
              <RoleGate allowedRoles={['admin']}>
                <UserManagementPage />
              </RoleGate>
            }
          />

          {/* Settings (Visible to All) */}
          <Route
            path="settings"
            element={
              <RoleGate allowedRoles={['admin', 'sales_rep', 'technical', 'manager']}>
                <SettingsPage />
              </RoleGate>
            }
          />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
