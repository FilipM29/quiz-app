/**
 * Application logger with environment-aware logging
 *
 * Usage:
 *   import { logger } from '@/utils/logger';
 *   logger.debug('Debug message', { data });
 *   logger.info('Info message');
 *   logger.warn('Warning message');
 *   logger.error('Error message', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabledInProduction: boolean;
  minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  private config: LoggerConfig;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.config = {
      enabledInProduction: false, // Change to true if you want logging in production
      minLevel: this.isDevelopment ? 'debug' : 'error' // Only errors in production by default
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In development, always log
    if (this.isDevelopment) {
      return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
    }

    // In production, check config
    if (!this.config.enabledInProduction) {
      return false;
    }

    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: unknown, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error, ...args);

      // TODO: In production, send to error reporting service
      // Example: Sentry.captureException(error, { extra: { message, ...args } });
    }
  }

  /**
   * Special method for logging in production
   * Useful for critical events you always want to track
   */
  production(message: string, ...args: unknown[]): void {
    if (!this.isDevelopment) {
      console.log(`[PRODUCTION] ${message}`, ...args);
      // TODO: Send to analytics/monitoring service
    }
  }
}

export const logger = new Logger();
