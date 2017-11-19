const path = require('path');
const rootPath = path.normalize(__dirname + '/..');

const env = process.env.NODE_ENV || 'dev';
const envPort = process.env.PORT;
const envConnString = process.env.MONGODB_URI;
const envDbSecret = process.env.SECRET;

const config = {
    dev: {
        port: envPort || 3000,
        connectionString: envConnString || 'mongodb://localhost:27017/crypto-store-db',
        secretString: envDbSecret || 'Secret magical popcorn',
    },
    production: {
        port: envPort,
        connectionString: envConnString,
        secretString: envDbSecret,
    },
};

module.exports = config[env];