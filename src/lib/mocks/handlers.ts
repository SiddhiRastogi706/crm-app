import { http, HttpResponse, delay } from 'msw';
import { mockDb } from './db';

export const handlers = [
  // --- AUTH ---
  http.post('/api/auth/login', async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as any;
    const { email, password } = body;

    const user = mockDb.getUserByEmail(email);
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Accept password or standard 'password123'
    if (password !== 'password123' && password.length < 6) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const accessToken = `mock-jwt-access-${user.id}-${Date.now()}`;
    const refreshToken = `mock-jwt-refresh-${user.id}-${Date.now()}`;

    return HttpResponse.json({
      user: { ...user, email },
      accessToken,
      refreshToken,
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as any;
    const { name, email, role = 'sales_rep' } = body;

    const existing = mockDb.getUserByEmail(email);
    if (existing) {
      return HttpResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const newUser = mockDb.createUser({
      name,
      email,
      role,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    });

    const accessToken = `mock-jwt-access-${newUser.id}-${Date.now()}`;
    const refreshToken = `mock-jwt-refresh-${newUser.id}-${Date.now()}`;

    return HttpResponse.json({
      user: newUser,
      accessToken,
      refreshToken,
    });
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const { refreshToken } = body;

    if (!refreshToken || !refreshToken.startsWith('mock-jwt-refresh-')) {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }

    // Extract user ID
    const parts = refreshToken.split('-');
    const userId = `${parts[3]}-${parts[4]}`;
    const user = mockDb.getUserById(userId) || mockDb.getUsers()[0];

    const newAccessToken = `mock-jwt-access-${user.id}-${Date.now()}`;
    const newRefreshToken = `mock-jwt-refresh-${user.id}-${Date.now()}`;

    return HttpResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(150);
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/auth/forgot-password', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      message: `Password reset link sent to ${body.email}`,
    });
  }),

  http.post('/api/auth/reset-password', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now login.',
    });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const parts = token.split('-');
    const userId = parts.length >= 5 ? `${parts[3]}-${parts[4]}` : 'user-1';
    const user = mockDb.getUserById(userId) || mockDb.getUsers()[0];

    return HttpResponse.json({ user });
  }),

  // --- USERS ---
  http.get('/api/users', async () => {
    await delay(150);
    return HttpResponse.json(mockDb.getUsers());
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as any;
    const created = mockDb.createUser(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const updated = mockDb.updateUser(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(200);
    mockDb.deleteUser(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  // --- CONTACTS ---
  http.get('/api/contacts', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const source = url.searchParams.get('source') || undefined;
    const ownerId = url.searchParams.get('ownerId') || undefined;
    const sortBy = url.searchParams.get('sortBy') || undefined;
    const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const result = mockDb.getContacts({
      search,
      status,
      source,
      ownerId,
      sortBy,
      sortOrder,
      page,
      limit,
    });
    return HttpResponse.json(result);
  }),

  http.get('/api/contacts/:id', async ({ params }) => {
    await delay(150);
    const contact = mockDb.getContactById(params.id as string);
    if (!contact) return HttpResponse.json({ message: 'Contact not found' }, { status: 404 });
    return HttpResponse.json(contact);
  }),

  http.post('/api/contacts', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as any;
    const created = mockDb.createContact(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/contacts/:id', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const updated = mockDb.updateContact(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'Contact not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/contacts/:id', async ({ params }) => {
    await delay(200);
    mockDb.deleteContact(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/contacts/bulk-delete', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as any;
    mockDb.bulkDeleteContacts(body.ids || []);
    return HttpResponse.json({ success: true });
  }),

  // --- LEADS ---
  http.get('/api/leads', async () => {
    await delay(200);
    return HttpResponse.json(mockDb.getLeads());
  }),

  http.get('/api/leads/:id', async ({ params }) => {
    await delay(150);
    const lead = mockDb.getLeadById(params.id as string);
    if (!lead) return HttpResponse.json({ message: 'Lead not found' }, { status: 404 });
    return HttpResponse.json(lead);
  }),

  http.post('/api/leads', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as any;
    const created = mockDb.createLead(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/leads/:id', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const updated = mockDb.updateLead(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'Lead not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/leads/:id', async ({ params }) => {
    await delay(200);
    mockDb.deleteLead(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/leads/:id/convert', async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as any;
    const result = mockDb.convertLead(params.id as string, body);
    if (!result) return HttpResponse.json({ message: 'Failed to convert lead' }, { status: 400 });
    return HttpResponse.json(result);
  }),

  // --- DEALS ---
  http.get('/api/deals', async () => {
    await delay(200);
    return HttpResponse.json(mockDb.getDeals());
  }),

  http.get('/api/deals/:id', async ({ params }) => {
    await delay(150);
    const deal = mockDb.getDealById(params.id as string);
    if (!deal) return HttpResponse.json({ message: 'Deal not found' }, { status: 404 });
    return HttpResponse.json(deal);
  }),

  http.post('/api/deals', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as any;
    const created = mockDb.createDeal(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/deals/:id', async ({ params, request }) => {
    await delay(150); // fast for drag and drop
    const body = (await request.json()) as any;
    const updated = mockDb.updateDeal(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'Deal not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/deals/:id', async ({ params }) => {
    await delay(200);
    mockDb.deleteDeal(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  // --- ACTIVITIES ---
  http.get('/api/activities', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const contactId = url.searchParams.get('contactId') || undefined;
    return HttpResponse.json(mockDb.getActivities(contactId));
  }),

  http.post('/api/activities', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const created = mockDb.createActivity(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  // --- TASKS ---
  http.get('/api/tasks', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const contactId = url.searchParams.get('contactId') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const assignedToId = url.searchParams.get('assignedToId') || undefined;
    return HttpResponse.json(mockDb.getTasks({ contactId, status, assignedToId }));
  }),

  http.post('/api/tasks', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const created = mockDb.createTask(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/tasks/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as any;
    const updated = mockDb.updateTask(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/tasks/:id', async ({ params }) => {
    await delay(150);
    mockDb.deleteTask(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  // --- TICKETS ---
  http.get('/api/tickets', async () => {
    await delay(200);
    return HttpResponse.json(mockDb.getTickets());
  }),

  http.get('/api/tickets/:id', async ({ params }) => {
    await delay(150);
    const ticket = mockDb.getTicketById(params.id as string);
    if (!ticket) return HttpResponse.json({ message: 'Ticket not found' }, { status: 404 });
    return HttpResponse.json(ticket);
  }),

  http.post('/api/tickets', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as any;
    const created = mockDb.createTicket(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/tickets/:id', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const updated = mockDb.updateTicket(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'Ticket not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.post('/api/tickets/:id/comments', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const updated = mockDb.addTicketComment(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'Ticket not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  // --- CAMPAIGNS ---
  http.get('/api/campaigns', async () => {
    await delay(200);
    return HttpResponse.json(mockDb.getCampaigns());
  }),

  http.post('/api/campaigns', async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as any;
    const created = mockDb.createCampaign(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  // --- AUTOMATIONS ---
  http.get('/api/automations', async () => {
    await delay(150);
    return HttpResponse.json(mockDb.getAutomations());
  }),

  http.post('/api/automations', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const created = mockDb.createAutomation(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/automations/:id', async ({ params, request }) => {
    await delay(150);
    const body = (await request.json()) as any;
    const updated = mockDb.updateAutomation(params.id as string, body);
    if (!updated) return HttpResponse.json({ message: 'Automation not found' }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete('/api/automations/:id', async ({ params }) => {
    await delay(150);
    mockDb.deleteAutomation(params.id as string);
    return HttpResponse.json({ success: true });
  }),

  // --- NOTIFICATIONS ---
  http.get('/api/notifications', async () => {
    await delay(100);
    return HttpResponse.json(mockDb.getNotifications());
  }),

  http.post('/api/notifications', async ({ request }) => {
    const body = (await request.json()) as any;
    const created = mockDb.createNotification(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch('/api/notifications/:id/read', async ({ params }) => {
    const updated = mockDb.markNotificationAsRead(params.id as string);
    return HttpResponse.json(updated);
  }),

  http.post('/api/notifications/read-all', async () => {
    mockDb.markAllNotificationsAsRead();
    return HttpResponse.json({ success: true });
  }),

  // --- DASHBOARD METRICS ---
  http.get('/api/dashboard/metrics', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '30d';
    return HttpResponse.json(mockDb.getDashboardMetrics(range));
  }),

  // --- GLOBAL SEARCH ---
  http.get('/api/search', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    return HttpResponse.json(mockDb.globalSearch(q));
  }),

  // --- SOLD PRODUCTS & SOFTWARE LICENSES ---
  http.get('/api/products/expiring', async () => {
    await delay(100);
    return HttpResponse.json(mockDb.getExpiringProducts());
  }),

  http.get('/api/products', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const contactId = url.searchParams.get('contactId') || undefined;
    return HttpResponse.json(mockDb.getSoldProducts(contactId));
  }),

  http.post('/api/products', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as any;
    const created = mockDb.createSoldProduct(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.post('/api/products/:id/renew', async ({ params, request }) => {
    await delay(200);
    const body = (await request.json().catch(() => ({}))) as any;
    const additionalMonths = body?.additionalMonths || 12;
    const renewed = mockDb.renewSoldProduct(params.id as string, additionalMonths);
    if (!renewed) return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    return HttpResponse.json(renewed);
  }),

  // --- RESET DB ---
  http.post('/api/reset-db', async () => {
    mockDb.reset();
    return HttpResponse.json({ success: true, message: 'Database reset to original seeds.' });
  }),
];
