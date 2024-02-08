import winston, { createLogger, transports, format } from 'winston';
const { align, printf } = winston.format;


const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.colorize(),
		align(),
		printf((info) => {
			const { timestamp, level, message } = info;
			return `[${level}]:[${timestamp}] ---> ${message}`;
		})
	),
	transports: [
		new transports.Console({ level: 'info', format: winston.format.simple() }),
		new transports.File({ filename: 'src/logs/error.log', level: 'error' }),
		new transports.File({ filename: 'src/logs/combined.log' })
	]
});
// do not exit logger when uncaught exception occures
logger.exitOnError = false;

export default logger;
