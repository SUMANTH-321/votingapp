const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('VotingApp', 'bbvoteuser', 'BiggBossVote@123', {
  host: 'localhost',
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: 'SQLEXPRESS'
    }
  }
});

module.exports = sequelize;
