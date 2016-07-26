/*jshint esversion: 6 */
(function() {
    exports.DATABASE_URL = process.env.DATABASE_URL ||
        global.DATABASE_URL ||
        (process.env.NODE_ENV === 'production' ?
        'mongodb://<dbuser>:<dbpassword>@ds029735.mlab.com:29735/restaurant-pos-db' :
        'mongodb://localhost/restaurant-pos-dev');
    exports.PORT = process.env.PORT || 8000;
})();
