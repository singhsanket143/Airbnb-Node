import winston from "winston";
import { getCorrelationId } from "../utils/helpers/request.helpers";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "MM-DD-YYYY HH:mm:ss"  }), // how the timestamp should be formatted
        winston.format.json(), // Format the log message as JSON
        // define a cutom print
        winston.format.printf( ({  level, message, timestamp, ...data }) => {
            const output = { 
                level,
                message, 
                timestamp, 
                correlationId: getCorrelationId(), 
                data 
            };
            return JSON.stringify(output);
        })
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: "logs/%DATE%-app.log", // The file name pattern
            datePattern: "YYYY-MM-DD", // The date format
            maxSize: "20m", // The maximum size of the log file
            maxFiles: "14d", // The maximum number of log files to keep
        })
        // TODO: add logic to integrate and save logs in mongo
    ]
});

export default logger;