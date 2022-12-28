import { Schema } from '../validation/body_parser';

/**
 * Body parser type definition for POST /api/url
 */
export type CreateUrlParser = {
  url: string;
};

/**
 * Body parser schema
 */
export const UrlSchema: Schema = {
  fields: {
    url: 'string',
  },
  required: ['url'],
};
