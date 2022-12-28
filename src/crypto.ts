import crypto from 'crypto';
import { logError, logInfo } from './logger';

export function shortenUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(4, (err, buffer) => {
      if (err) {
        logError(`Error while creating short url: ${err.message}`);
        reject(err.message);
      } else {
        let ret = buffer.toString('hex');
        logInfo(`Created short url: ${ret} | original url: ${url}`);
        resolve(ret);
      }
    });
  });
}
