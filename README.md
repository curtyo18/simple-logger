# simple-logger

A very lightweight TypeScript logger. Four levels, env-driven default, injectable console-like sink.

## Install

This package is not currently published to npm. Clone the repo and reference it locally:

```sh
git clone https://github.com/curtyo18/simple-logger.git
cd simple-logger
npm install
npm run build
```

## Quick start

```ts
import { log } from 'simple-logger';

log.info('server started', { port: 3000 });
log.error('something broke', new Error('boom'));
```

By default the logger emits at `info` and above. Set `LOG_LEVEL` in the environment to change it at module load:

```sh
LOG_LEVEL=debug node app.js
```

Valid levels: `error`, `warn`, `info`, `debug`. Invalid values silently fall back to `info`.

## Class API

For independent loggers (own level, own sink) create instances directly:

```ts
import { Logger } from 'simple-logger';

const logger = new Logger({ level: 'debug' });
logger.debug('verbose detail');
logger.setLevel('warn');
logger.debug('suppressed now');
logger.getLevel(); // 'warn'
```

Level priority is `error < warn < info < debug`. A logger at level `X` emits any call at priority `≤` priority(X). Calling `setLevel` with an invalid level throws a `TypeError`. Log methods themselves never throw.

## Injecting a sink

Any object satisfying `ConsoleLike` (i.e. `error`, `warn`, `info`, `debug` methods) can be used in place of `globalThis.console`:

```ts
import { Logger, type ConsoleLike } from 'simple-logger';

const captured: Array<[string, unknown[]]> = [];
const sink: ConsoleLike = {
  error: (...args) => captured.push(['error', args]),
  warn: (...args) => captured.push(['warn', args]),
  info: (...args) => captured.push(['info', args]),
  debug: (...args) => captured.push(['debug', args]),
};

const logger = new Logger({ level: 'debug', sink });
logger.info('hello', { id: 1 });
// captured === [['info', ['hello', { id: 1 }]]]
```

## API reference

### `class Logger`

- `new Logger(options?: LoggerOptions)` — `options.level` defaults to `'info'`, `options.sink` defaults to `globalThis.console`.
- `error(...args: unknown[]): void`
- `warn(...args: unknown[]): void`
- `info(...args: unknown[]): void`
- `debug(...args: unknown[]): void`
- `log(level: LogLevel, ...args: unknown[]): void` — generic dispatcher used by the level methods above.
- `setLevel(level: LogLevel): void` — throws `TypeError` if `level` is not one of the valid `LogLevel` values.
- `getLevel(): LogLevel`

### `const log: Logger`

Module-level default singleton. Level is seeded from `process.env.LOG_LEVEL` at module load. In environments without `process` (e.g. browsers) the level defaults to `'info'`.

### Types

- `type LogLevel = 'error' | 'warn' | 'info' | 'debug'`
- `interface ConsoleLike` — `error`, `warn`, `info`, `debug` methods, each `(...args: unknown[]) => void`.
- `interface LoggerOptions` — `{ level?: LogLevel; sink?: ConsoleLike }`.

## License

MIT
