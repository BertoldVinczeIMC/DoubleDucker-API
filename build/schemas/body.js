"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserSchema = exports.LoginUserSchema = exports.UrlSchema = void 0;
/**
 * Body parser schema
 */
exports.UrlSchema = {
    fields: {
        url: 'string',
    },
    required: ['url'],
};
exports.LoginUserSchema = {
    fields: {
        email: 'string',
        password: 'string',
    },
    required: ['email', 'password'],
};
exports.RegisterUserSchema = {
    fields: {
        email: 'string',
        password: 'string',
        name: 'string',
        secret: 'string',
    },
    required: ['email', 'password', 'secret'],
};
//# sourceMappingURL=body.js.map