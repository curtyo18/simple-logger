import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('default singleton', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to info when LOG_LEVEL is unset', async () => {
    vi.stubEnv('LOG_LEVEL', '');
    const { log } = await import('../src/logger.js');
    expect(log.getLevel()).toBe('info');
  });

  it('honors LOG_LEVEL=debug', async () => {
    vi.stubEnv('LOG_LEVEL', 'debug');
    const { log } = await import('../src/logger.js');
    expect(log.getLevel()).toBe('debug');
  });

  it('honors LOG_LEVEL=error', async () => {
    vi.stubEnv('LOG_LEVEL', 'error');
    const { log } = await import('../src/logger.js');
    expect(log.getLevel()).toBe('error');
  });

  it('falls back to info for invalid LOG_LEVEL', async () => {
    vi.stubEnv('LOG_LEVEL', 'garbage');
    const { log } = await import('../src/logger.js');
    expect(log.getLevel()).toBe('info');
  });
});
