// Backend configuration

module.exports = {
    db: {
        host: 'database-host',
        user: 'database-user',
        pass: 'user-password',
        name: 'database-name',
        port: 3306
    },
    server: {
        port: 8080,
        allowedOrigins: 'http://localhost:3000',
    },
    batchSize: 3,
}