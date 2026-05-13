export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface ConsoleLike {
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  info(...args: unknown[]): void;
  debug(...args: unknown[]): void;
}

export interface LoggerOptions {
  level?: LogLevel;
  sink?: ConsoleLike;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export class Logger {
  private level: LogLevel;
  private sink: ConsoleLike;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? 'info';
    this.sink = options.sink ?? (globalThis.console as ConsoleLike);
  }

  setLevel(level: LogLevel): void {
    if (!(level in LEVEL_PRIORITY)) {
      throw new TypeError(`invalid log level: ${String(level)}`);
    }
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  error(...args: unknown[]): void {
    this.log('error', ...args);
  }
  warn(...args: unknown[]): void {
    this.log('warn', ...args);
  }
  info(...args: unknown[]): void {
    this.log('info', ...args);
  }
  debug(...args: unknown[]): void {
    this.log('debug', ...args);
  }

  log(level: LogLevel, ...args: unknown[]): void {
    if (LEVEL_PRIORITY[level]! <= LEVEL_PRIORITY[this.level]!) {
      this.sink[level](...args);
    }
  }
}
