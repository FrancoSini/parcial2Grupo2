const Server = require('./core/server');

const servidor = new Server();

module.exports = servidor.getApp();