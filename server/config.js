exports.DATABASE_URL = process.env.DATABASE_URL ||
                      global.DATABASE_URL ||
                      process.env.NODE_ENV === 'production' ?
                      'mongodb://localhost/restaurant-pos' :
                      'mongodb://localhost/restaurant-pos-dev';
exports.PORT = process.env.PORT || 8000;
