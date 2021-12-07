import type { Meta } from '../meta';
import { TransportItemType } from '../transports';
import type { Transports } from '../transports';
import type { BaseObject } from '../utils/baseObject';
import { getCurrentTimestamp } from '../utils/getCurrentTimestamp';

export interface LogEvent {
  context: LogContext;
  level: LogLevels;
  message: string;
  timestamp: string;
}

export enum LogLevels {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
}

export type LogContext = BaseObject;

export interface LoggerLog {
  pushLog: (args: unknown[], level?: LogLevels, context?: LogContext) => void;
}

export const defaultLogLevel = LogLevels.LOG;

export function initializeLoggerLog(transports: Transports, meta: Meta): LoggerLog {
  const pushLog: LoggerLog['pushLog'] = (args, level = defaultLogLevel, context = {}) => {
    try {
      transports.execute({
        type: TransportItemType.LOGS,
        payload: {
          message: args
            .map((arg) => {
              try {
                return String(arg);
              } catch (err) {
                return '';
              }
            })
            .join(' '),
          level,
          context,
          timestamp: getCurrentTimestamp(),
        },
        meta: meta.values,
      });
    } catch (err) {}
  };

  return {
    pushLog,
  };
}