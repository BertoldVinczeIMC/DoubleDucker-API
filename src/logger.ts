import fs from "fs";
import { Request, Response, NextFunction } from "express";

/**
 * Logs every request to the server
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const message = `${req.method} ${req.path} ${req.ip}`;
  logInfo(message);
  next();
}

/**
 * Logs an info message to the log file
 * @param message string
 */
export function logInfo(message: string) {
  // now in DD/MM/YYYY HH:MM:SS format
  const date = new Date().toLocaleString("at-AT");
  // create prefix like [date] [info]
  const prefix = `[${date}] [info]: `;
  message = prefix + message + "\n";
  fs.appendFile("log.txt", message, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

/**
 * Logs an error message to the log file
 *
 */
export function logError(message: string) {
  // now in DD/MM/YYYY HH:MM:SS format
  const date = new Date().toLocaleString("at-AT");
  // create prefix like [date] [info]
  const prefix = `[${date}] [error]: `;
  message = prefix + message;
  fs.appendFile("log.txt", message, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

/**
 * Logs a warning message to the log file
 * @param message string
 */
export function logWarning(message: string) {
  // now in DD/MM/YYYY HH:MM:SS format
  const date = new Date().toLocaleString("at-AT");
  // create prefix like [date] [info]
  const prefix = `[${date}] [warning]: `;
  message = prefix + message;
  fs.appendFile("log.txt", message, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
