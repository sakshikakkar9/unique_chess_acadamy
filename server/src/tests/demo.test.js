import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as demoService from '../services/demo.service.js';
import prisma from '../../lib/prisma.js';

vi.mock('../../lib/prisma.js', () => ({
  default: {
    demoRegistration: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Demo Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a demo registration with city', async () => {
    const mockData = {
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      city: 'New York',
      scheduledAt: '2026-05-14T10:00:00.000Z',
    };

    prisma.demoRegistration.create.mockResolvedValue({ id: 1, ...mockData, status: 'PENDING' });

    const result = await demoService.createDemoRegistration(mockData);

    expect(prisma.demoRegistration.create).toHaveBeenCalledWith({
      data: {
        studentName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        city: 'New York',
        scheduledAt: expect.any(Date),
        status: 'PENDING',
      },
    });
    expect(result.city).toBe('New York');
  });

  it('should update demo status correctly', async () => {
    prisma.demoRegistration.update.mockResolvedValue({ id: 1, status: 'COMPLETED' });

    const result = await demoService.updateDemoStatus('1', 'COMPLETED');

    expect(prisma.demoRegistration.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'COMPLETED' },
    });
    expect(result.status).toBe('COMPLETED');
  });

  it('should throw error for invalid ID in update', async () => {
    await expect(demoService.updateDemoStatus('invalid', 'COMPLETED'))
      .rejects.toThrow('Invalid Demo ID');
  });

  it('should delete a demo registration', async () => {
    prisma.demoRegistration.delete.mockResolvedValue({ id: 1 });

    const result = await demoService.deleteDemoRegistration('1');

    expect(prisma.demoRegistration.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
