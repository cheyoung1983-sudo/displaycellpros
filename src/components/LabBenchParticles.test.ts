import { describe, it, expect } from '@jest/globals';
import { LabBenchParticles } from './LabBenchParticles';

describe('LabBenchParticles Component', () => {
  it('is exported as a valid functional component', () => {
    expect(LabBenchParticles).toBeDefined();
    expect(typeof LabBenchParticles).toBe('function');
  });
});
