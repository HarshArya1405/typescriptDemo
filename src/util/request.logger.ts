import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body, ip } = req;
    const timestamp = new Date().toLocaleString('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    logger.info(`[${timestamp}] ${method} ${originalUrl} from ${ip} - Query: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}`);

    next();
}
