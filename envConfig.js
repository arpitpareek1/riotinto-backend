const env = require("./env.json");

const envConfig = () => {
    const nodeEnv = process.env.NODE_ENV || "development";
    return env[nodeEnv];
};
module.exports = envConfig;