const express = require('express');
const sequelize = require('../shared/db');
const { DataTypes } = require('sequelize');

const Vote = sequelize.define('Vote', {
  Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  ContestantId: { type: DataTypes.INTEGER, allowNull: false },
  VoteDate: { type: DataTypes.DATEONLY, allowNull: false },
  DeviceIp: { type: DataTypes.STRING }
}, { tableName: 'Votes', timestamps: false });

const Contestant = sequelize.define('Contestant', {
  Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  Name: { type: DataTypes.STRING, allowNull: false },
  ImageUrl: { type: DataTypes.STRING },
  Week: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Contestants', timestamps: false });

const app = express();

app.get('/results', async (req, res) => {
  const week = req.query.week || 1;
  const contestants = await Contestant.findAll({ where: { Week: week } });
  const votes = await Vote.findAll();

  const voteCounts = contestants.map(c => ({
    id: c.Id,
    name: c.Name,
    count: votes.filter(v => v.ContestantId === c.Id).length
  }));
  const total = voteCounts.reduce((sum, v) => sum + v.count, 0);
  const results = voteCounts.map(v => ({
    id: v.id,
    name: v.name,
    percentage: total ? ((v.count / total) * 100).toFixed(2) : "0.00"
  }));
  res.json(results);
});

sequelize.authenticate()
  .then(() => app.listen(5003, () => console.log("Result service running on port 5003")))
  .catch(err => console.error('DB Connection error:', err));
