import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Pulse CRM REST API',
    version: '1.0.0',
    description: 'Enterprise REST API backend for Pulse CRM with Role-Based Access Control, PostgreSQL, and Prisma ORM.',
    contact: {
      name: 'Pulse CRM Engineering',
      email: 'support@pulsecrm.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Default API Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['admin', 'manager', 'sales_rep'] },
          avatar: { type: 'string', format: 'uri' },
          status: { type: 'string', enum: ['active', 'inactive'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Contact: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          company: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string', enum: ['lead', 'active', 'inactive', 'customer'] },
          source: { type: 'string', enum: ['website', 'referral', 'linkedin', 'outbound', 'conference'] },
          ownerId: { type: 'string' },
          ownerName: { type: 'string' },
          value: { type: 'number' },
          tags: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string' },
        },
      },
      Lead: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          company: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string', enum: ['new', 'contacted', 'qualified', 'disqualified'] },
          source: { type: 'string', enum: ['organic', 'referral', 'linkedin', 'adwords', 'outbound'] },
          score: { type: 'integer', minimum: 0, maximum: 100 },
          ownerId: { type: 'string' },
          ownerName: { type: 'string' },
          estimatedValue: { type: 'number' },
        },
      },
      Deal: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          contactId: { type: 'string' },
          company: { type: 'string' },
          value: { type: 'number' },
          stage: { type: 'string', enum: ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] },
          probability: { type: 'integer' },
          ownerId: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate user & receive tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@pulsecrm.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authenticated successfully' },
          401: { description: 'Invalid email or password' },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new account',
        responses: { 201: { description: 'Account registered' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user profile',
        responses: { 200: { description: 'Current user profile' } },
      },
    },
    '/contacts': {
      get: {
        tags: ['Contacts'],
        summary: 'List contacts with pagination, search, sorting and filters',
        responses: { 200: { description: 'Paginated contacts' } },
      },
      post: {
        tags: ['Contacts'],
        summary: 'Create a new contact',
        responses: { 201: { description: 'Contact created' } },
      },
    },
    '/contacts/export': {
      get: {
        tags: ['Contacts'],
        summary: 'Export contacts to CSV',
        responses: { 200: { description: 'CSV file download' } },
      },
    },
    '/contacts/import': {
      post: {
        tags: ['Contacts'],
        summary: 'Import contacts from CSV with validation and error reporting',
        responses: { 200: { description: 'Import summary and error breakdown' } },
      },
    },
    '/leads': {
      get: {
        tags: ['Leads'],
        summary: 'List leads',
        responses: { 200: { description: 'Leads array' } },
      },
      post: {
        tags: ['Leads'],
        summary: 'Create a lead with automatic scoring',
        responses: { 201: { description: 'Lead created' } },
      },
    },
    '/leads/{id}/convert': {
      post: {
        tags: ['Leads'],
        summary: 'Convert lead to Contact and Deal atomically',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Converted contact and deal' } },
      },
    },
    '/deals': {
      get: {
        tags: ['Deals'],
        summary: 'List deals',
        responses: { 200: { description: 'Deals array' } },
      },
      post: {
        tags: ['Deals'],
        summary: 'Create a new deal',
        responses: { 201: { description: 'Deal created' } },
      },
    },
    '/deals/pipeline-summary': {
      get: {
        tags: ['Deals'],
        summary: 'Pipeline summary with deal counts and value by stage',
        responses: { 200: { description: 'Pipeline stage breakdown' } },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List tasks with status and date filters',
        responses: { 200: { description: 'Tasks array' } },
      },
    },
    '/tasks/calendar': {
      get: {
        tags: ['Tasks'],
        summary: 'Calendar events for tasks',
        responses: { 200: { description: 'Calendar events array' } },
      },
    },
    '/dashboard/metrics': {
      get: {
        tags: ['Dashboard'],
        summary: 'KPI metrics, revenue trend, and funnel metrics',
        parameters: [{ name: 'range', in: 'query', schema: { type: 'string', default: '30d' } }],
        responses: { 200: { description: 'Dashboard metrics object' } },
      },
    },
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Command palette search across contacts, deals, tickets',
        parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Matched entities' } },
      },
    },
  },
};

const router = Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;
