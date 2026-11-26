import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/features/auth/stores/authStore';

describe('Auth Store & Role Permissions', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('initial state is unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('logs in successfully and sets user credentials', async () => {
    await useAuthStore.getState().login({
      email: 'admin@pulsecrm.com',
      password: 'password123',
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('admin@pulsecrm.com');
    expect(state.user?.role).toBe('admin');
    expect(state.tokens?.accessToken).toBeDefined();
  });

  it('supports role switching in demo mode', async () => {
    await useAuthStore.getState().login({
      email: 'admin@pulsecrm.com',
      password: 'password123',
    });

    useAuthStore.getState().switchRole('sales_rep');
    expect(useAuthStore.getState().user?.role).toBe('sales_rep');

    useAuthStore.getState().switchRole('manager');
    expect(useAuthStore.getState().user?.role).toBe('manager');
  });

  it('clears state on logout', async () => {
    await useAuthStore.getState().login({
      email: 'admin@pulsecrm.com',
      password: 'password123',
    });

    await useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
