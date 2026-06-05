import { describe, it, expect } from 'vitest';
import { resolveRegistrationStatus } from '../lib/statusUtils';

describe('resolveRegistrationStatus', () => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  const futureISO = future.toISOString().split('T')[0];

  const past = new Date();
  past.setFullYear(past.getFullYear() - 1);
  const pastISO = past.toISOString().split('T')[0];

  it('should return OPEN when within window', () => {
    expect(resolveRegistrationStatus(
      futureISO, futureISO, pastISO, futureISO, 'upcoming'
    )).toBe('OPEN');
  });

  it('should return CLOSED when manual status is completed', () => {
    expect(resolveRegistrationStatus(
      pastISO, pastISO, pastISO, pastISO, 'completed'
    )).toBe('CLOSED');
  });

  it('should return NOT_STARTED when regStartDate is in future', () => {
    expect(resolveRegistrationStatus(
      futureISO, futureISO, futureISO, futureISO, 'upcoming'
    )).toBe('NOT_STARTED');
  });

  it('should return CLOSED when regEndDate is in past', () => {
    expect(resolveRegistrationStatus(
      futureISO, futureISO, pastISO, pastISO, 'upcoming'
    )).toBe('CLOSED');
  });
});
