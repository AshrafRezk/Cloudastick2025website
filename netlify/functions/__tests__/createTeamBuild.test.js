/**
 * Unit tests for createTeamBuild Netlify function
 * Tests composite API handling, duplicate prevention, and error scenarios
 */

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const handler = require('../createTeamBuild').handler;

describe('createTeamBuild', () => {
  const mockEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
      access_token: 'test_token',
      instance_url: 'https://test.salesforce.com',
      accountId: '001000000000001AAA',
      scope: 'Test scope',
      deliverables: 'Test deliverables',
      teamMembers: ['Ahmed Salah', 'Jenny Maged'],
    }),
  };

  const mockContext = {};

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('Composite API Success', () => {
    it('should create team build and members successfully via composite API', async () => {
      // Mock Team build creation
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000001AAA' }),
        })
        // Mock initial duplicate check (empty)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        // Mock composite API success
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            compositeResponse: [
              {
                httpStatusCode: 201,
                body: { id: 'a0X000000000002AAA', success: true },
              },
              {
                httpStatusCode: 201,
                body: { id: 'a0X000000000003AAA', success: true },
              },
            ],
          }),
        })
        // Mock post-composite verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000003AAA', Name: 'Jenny Maged' },
            ],
          }),
        })
        // Mock final verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000003AAA', Name: 'Jenny Maged' },
            ],
          }),
        });

      const result = await handler(mockEvent, mockContext);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.teamBuildId).toBe('a0X000000000001AAA');
      expect(body.memberIds).toHaveLength(2);
      expect(body.memberIds).toContain('a0X000000000002AAA');
      expect(body.memberIds).toContain('a0X000000000003AAA');
      expect(body.requestId).toBeDefined();
    });
  });

  describe('Composite API Partial Failure', () => {
    it('should create remaining members individually after partial composite failure', async () => {
      // Mock Team build creation
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000001AAA' }),
        })
        // Mock initial duplicate check (empty)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        // Mock composite API partial success (one fails)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            compositeResponse: [
              {
                httpStatusCode: 201,
                body: { id: 'a0X000000000002AAA', success: true },
              },
              {
                httpStatusCode: 400,
                body: [{ message: 'Validation error' }],
              },
            ],
          }),
        })
        // Mock post-composite verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [{ Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' }],
          }),
        })
        // Mock individual member check (doesn't exist)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        // Mock individual member creation
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000004AAA' }),
        })
        // Mock final verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000004AAA', Name: 'Jenny Maged' },
            ],
          }),
        });

      const result = await handler(mockEvent, mockContext);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.memberIds).toHaveLength(2);
      // Should have created one via composite and one individually
      expect(global.fetch).toHaveBeenCalledTimes(7);
    });
  });

  describe('Duplicate Prevention', () => {
    it('should skip members that already exist', async () => {
      // Mock Team build creation
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000001AAA' }),
        })
        // Mock initial duplicate check (one already exists)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [{ Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' }],
          }),
        })
        // Mock composite API for remaining member
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            compositeResponse: [
              {
                httpStatusCode: 201,
                body: { id: 'a0X000000000003AAA', success: true },
              },
            ],
          }),
        })
        // Mock post-composite verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000003AAA', Name: 'Jenny Maged' },
            ],
          }),
        })
        // Mock final verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000003AAA', Name: 'Jenny Maged' },
            ],
          }),
        });

      const result = await handler(mockEvent, mockContext);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.memberIds).toHaveLength(2);
      // Should only create one new member, not duplicate the existing one
      expect(global.fetch).toHaveBeenCalledTimes(5);
    });

    it('should detect and report duplicates in final verification', async () => {
      // Mock Team build creation
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000001AAA' }),
        })
        // Mock initial duplicate check (empty)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        // Mock composite API success
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            compositeResponse: [
              {
                httpStatusCode: 201,
                body: { id: 'a0X000000000002AAA', success: true },
              },
              {
                httpStatusCode: 201,
                body: { id: 'a0X000000000003AAA', success: true },
              },
            ],
          }),
        })
        // Mock post-composite verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000003AAA', Name: 'Jenny Maged' },
            ],
          }),
        })
        // Mock final verification with duplicates (simulating a bug scenario)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000003AAA', Name: 'Jenny Maged' },
              { Id: 'a0X000000000004AAA', Name: 'Ahmed Salah' }, // Duplicate
              { Id: 'a0X000000000005AAA', Name: 'Jenny Maged' }, // Duplicate
            ],
          }),
        });

      const result = await handler(mockEvent, mockContext);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      // Should log duplicate detection
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('DUPLICATE DETECTED')
      );
    });
  });

  describe('Composite API Complete Failure', () => {
    it('should fallback to individual creation when composite API fails', async () => {
      // Mock Team build creation
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000001AAA' }),
        })
        // Mock initial duplicate check (empty)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        // Mock composite API failure
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Internal server error',
        })
        // Mock post-composite verification (empty - composite failed)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        // Mock individual member checks and creations
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000002AAA' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ records: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'a0X000000000003AAA' }),
        })
        // Mock final verification
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              { Id: 'a0X000000000002AAA', Name: 'Ahmed Salah' },
              { Id: 'a0X000000000003AAA', Name: 'Jenny Maged' },
            ],
          }),
        });

      const result = await handler(mockEvent, mockContext);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.memberIds).toHaveLength(2);
      // Should have attempted composite, then created individually
      expect(global.fetch).toHaveBeenCalledTimes(9);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required fields', async () => {
      const invalidEvent = {
        httpMethod: 'POST',
        body: JSON.stringify({
          access_token: 'test_token',
          // Missing instance_url
        }),
      };

      const result = await handler(invalidEvent, mockContext);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(400);
      expect(body.error).toBeDefined();
    });

    it('should handle Team build creation failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => JSON.stringify([{ message: 'Validation error' }]),
      });

      const result = await handler(mockEvent, mockContext);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(400);
      expect(body.error).toBeDefined();
    });
  });

  describe('CORS Preflight', () => {
    it('should handle OPTIONS request', async () => {
      const optionsEvent = {
        httpMethod: 'OPTIONS',
      };

      const result = await handler(optionsEvent, mockContext);

      expect(result.statusCode).toBe(200);
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
    });
  });
});

