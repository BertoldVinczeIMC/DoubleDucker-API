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

export type LoginUserParser = {
  email: string;
  password: string;
};

export const LoginUserSchema: Schema = {
  fields: {
    email: 'string',
    password: 'string',
  },
  required: ['email', 'password'],
};

export type RegisterUserParser = {
  email: string;
  password: string;
  name: string;
  secret: string;
};

export const RegisterUserSchema: Schema = {
  fields: {
    email: 'string',
    password: 'string',
    name: 'string',
    secret: 'string',
  },
  required: ['email', 'password', 'secret'],
};
