const {
    config,
    SharedIniFileCredentials,
} = require('aws-sdk');
const envConfig = require('./envConfig');

const CONFIG = envConfig();

if (CONFIG.env === "development") {
    const CREDENTIALS = new SharedIniFileCredentials({ profile: CONFIG.profile });
    config.credentials = CREDENTIALS;
}