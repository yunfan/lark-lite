export type LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface Logger {
  debug?: (...args: unknown[]) => void;
  info?: (...args: unknown[]) => void;
  warn?: (...args: unknown[]) => void;
  error?: (...args: unknown[]) => void;
}

const levelOrder: Record<LoggerLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50
};

export function createLogger(level: LoggerLevel, logger?: Logger): Required<Logger> {
  const base: Logger = logger ?? console;
  const current = levelOrder[level] ?? levelOrder.info;
  const allow = (target: LoggerLevel) => current <= levelOrder[target];

  return {
    debug: allow('debug') && base.debug ? base.debug.bind(base) : () => {},
    info: allow('info') && base.info ? base.info.bind(base) : () => {},
    warn: allow('warn') && base.warn ? base.warn.bind(base) : () => {},
    error: allow('error') && base.error ? base.error.bind(base) : () => {}
  };
}
