var env = process.env.NODE_ENV || 'development'
var config = {
  "test": {
    "MONGODB_URI": "",
    "AUTH_SECRET": "",
    "AUTH_TOKEN_LIFETIMESPAN": 86400,
    "REDIS_PORT": 6379,
    "REDIS_HOST": '',
    "REDIS_PASS": ''
  },
  "development": {
    "MONGODB_URI": "",
    "AUTH_SECRET": "",
    "AUTH_TOKEN_LIFETIMESPAN": 86400,  // token will be expires in 24 hours
    "REDIS_PORT": 6379,
    "REDIS_HOST": '',
    "REDIS_PASS": ''
  },
  "production": {
    "MONGODB_URI": "",
    "AUTH_SECRET": "",
    "AUTH_TOKEN_LIFETIMESPAN": 86400,
    "REDIS_PORT": 15045,
    "REDIS_HOST": '',
    "REDIS_PASS": ''
  }
}

if (env === 'development' || env === 'test' || env === 'production') {
  var envConfig = config[env]
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}