import pino from 'pino';
import { AsyncLocalStorage } from 'node:async_hooks';

// Almacén asíncrono para guardar el contexto (traceId) a lo largo de toda la petición
export const asyncLocalStorage = new AsyncLocalStorage();

const isDev = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

// Logger base. En desarrollo usa pino-pretty para ser legible por humanos.
// En producción escupe JSONs crudos que DataDog, Kibana, etc., pueden ingerir.
export const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
});

// Este Proxy es la verdadera magia (The Big Leagues).
// Cuando importás este `logger` en CUALQUIER archivo y hacés logger.info(),
// el proxy se fija si estamos dentro de un request HTTP (gracias a AsyncLocalStorage).
// Si lo estamos, usa el logger específico de ese request que ya tiene el `traceId` inyectado.
// Si no, usa el baseLogger (ej: scripts, cronjobs, arranque del server).
export const logger = new Proxy(baseLogger, {
  get(target, property) {
    const store = asyncLocalStorage.getStore();
    const contextLogger = store?.logger;
    return contextLogger ? contextLogger[property] : target[property];
  },
});
