import moment from 'moment';
import morgan from 'morgan';

export const customLogger = morgan((tokens, req, res) => {
  return [
    `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms -',
    tokens.res(req, res, 'content-length'),
  ].join(' ');
}); 