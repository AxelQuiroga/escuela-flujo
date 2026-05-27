import crypto from 'crypto';
import { asyncLocalStorage, baseLogger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  // 1. Trace ID: Si viene del frontend/load balancer, lo usamos. Si no, creamos uno.
  const traceId = req.headers['x-trace-id'] || crypto.randomUUID();

  // 2. Creamos un logger derivado (child logger) que va a escupir este traceId en CADA log.
  const childLogger = baseLogger.child({ traceId });

  // 3. Empaquetamos todo en el store asíncrono
  const store = { logger: childLogger, traceId };

  // Ejecutamos el resto del ciclo de vida de la request DENTRO de este contexto
  asyncLocalStorage.run(store, () => {
    // Registramos cuándo empieza usando hrtime (alta precisión)
    const startTime = process.hrtime.bigint();

    childLogger.info({
      req: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }
    }, `Incoming Request: ${req.method} ${req.originalUrl}`);

    // Interceptamos cuando Express termina de mandar la respuesta
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      // Calculamos la duración en milisegundos
      const durationMs = Number(endTime - startTime) / 1_000_000;

      const logData = {
        res: {
          statusCode: res.statusCode,
          durationMs: parseFloat(durationMs.toFixed(2)),
        }
      };

      if (res.statusCode >= 500) {
        childLogger.error(logData, `Server Error: ${req.method} ${req.originalUrl} - ${res.statusCode} (${logData.res.durationMs}ms)`);
      } else if (res.statusCode >= 400) {
        childLogger.warn(logData, `Client Error: ${req.method} ${req.originalUrl} - ${res.statusCode} (${logData.res.durationMs}ms)`);
      } else {
        childLogger.info(logData, `Request Completed: ${req.method} ${req.originalUrl} - ${res.statusCode} (${logData.res.durationMs}ms)`);
      }
    });

    // Inyectar el Trace ID en los headers de respuesta para que el frontend lo pueda ver
    // y usar si hace un reporte de bug.
    res.setHeader('X-Trace-Id', traceId);

    next();
  });
};
