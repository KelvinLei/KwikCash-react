const environment = {
    development: {
        isProduction: false
    },
    production: {
        isProduction: true
    }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
    host: process.env.HOST || 'localhost',
    port: 3000,
    devServerPort: 3001,
    apiHost: process.env.APIHOST || 'localhost',
    apiPort: 3030,
    app: {
        title: 'KwikCash',
        description: 'KwikCash new system'
    }
}, environment);
