import { describe, expect, it, vi } from 'vitest';
import { Logger, type ConsoleLike, type LogLevel } from '../src/logger.js';

function makeSink(): ConsoleLike & {
  error: ReturnType<typeof vi.fn>;
  warn: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
  debug: ReturnType<typeof vi.fn>;
} {
  return {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  };
}

describe('Logger', () => {
  it('defaults to info level', () => {
    const logger = new Logger();
    expect(logger.getLevel()).toBe('info');
  });

  it('emits to the matching sink method when allowed', () => {
    const sink = makeSink();
    const logger = new Logger({ level: 'debug', sink });
    logger.error('e');
    logger.warn('w');
    logger.info('i');
    logger.debug('d');
    expect(sink.error).toHaveBeenCalledWith('e');
    expect(sink.warn).toHaveBeenCalledWith('w');
    expect(sink.info).toHaveBeenCalledWith('i');
    expect(sink.debug).toHaveBeenCalledWith('d');
  });

  it('suppresses lower-priority levels when at info', () => {
    const sink = makeSink();
    const logger = new Logger({ level: 'info', sink });
    logger.error('e');
    logger.warn('w');
    logger.info('i');
    logger.debug('d');
    expect(sink.error).toHaveBeenCalledTimes(1);
    expect(sink.warn).toHaveBeenCalledTimes(1);
    expect(sink.info).toHaveBeenCalledTimes(1);
    expect(sink.debug).not.toHaveBeenCalled();
  });

  it('suppresses everything but error when at error level', () => {
    const sink = makeSink();
    const logger = new Logger({ level: 'error', sink });
    logger.error('e');
    logger.warn('w');
    logger.info('i');
    logger.debug('d');
    expect(sink.error).toHaveBeenCalledTimes(1);
    expect(sink.warn).not.toHaveBeenCalled();
    expect(sink.info).not.toHaveBeenCalled();
    expect(sink.debug).not.toHaveBeenCalled();
  });

  it('fires all four levels at debug', () => {
    const sink = makeSink();
    const logger = new Logger({ level: 'debug', sink });
    logger.error('e');
    logger.warn('w');
    logger.info('i');
    logger.debug('d');
    expect(sink.error).toHaveBeenCalledTimes(1);
    expect(sink.warn).toHaveBeenCalledTimes(1);
    expect(sink.info).toHaveBeenCalledTimes(1);
    expect(sink.debug).toHaveBeenCalledTimes(1);
  });

  it('forwards variadic args unchanged', () => {
    const sink = makeSink();
    const logger = new Logger({ level: 'debug', sink });
    const err = new Error('x');
    logger.info('msg', { foo: 1 }, err);
    expect(sink.info).toHaveBeenCalledWith('msg', { foo: 1 }, err);
  });

  it('setLevel immediately changes filter behavior', () => {
    const sink = makeSink();
    const logger = new Logger({ level: 'error', sink });
    logger.debug('hidden');
    expect(sink.debug).not.toHaveBeenCalled();
    logger.setLevel('debug');
    logger.debug('shown');
    expect(sink.debug).toHaveBeenCalledWith('shown');
  });

  it('getLevel returns the current level', () => {
    const logger = new Logger({ level: 'warn' });
    expect(logger.getLevel()).toBe('warn');
    logger.setLevel('debug');
    expect(logger.getLevel()).toBe('debug');
  });

  it('setLevel with an invalid level throws TypeError', () => {
    const logger = new Logger();
    expect(() => logger.setLevel('garbage' as unknown as LogLevel)).toThrow(TypeError);
  });
});
