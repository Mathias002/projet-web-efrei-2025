// src/health/health.service.spec.ts
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthService();
  });

  it('should return "OK" for getHealth()', () => {
    expect(service.getHealth()).toBe('OK');
  });
});
