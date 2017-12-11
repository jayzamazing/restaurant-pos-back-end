'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/reactTrello';
exports.PORT = process.env.PORT || 3030;
exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.STATIC = process.env.STATIC || '/public';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
