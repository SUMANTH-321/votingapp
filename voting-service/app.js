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

const app = express();
app.use(express.json());

app.post('/vote', async (req, res) => {
  const { user_id, contestant_id, device_ip } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  // Only one vote per user per day
  const existing = await Vote.findOne({ where: { UserId: user_id, VoteDate: today } });
  if (existing) {
    return res.status(400).json({ error: "Already voted today" });
  }

  await Vote.create({ UserId: user_id, ContestantId: contestant_id, VoteDate: today, DeviceIp: device_ip });
  res.json({ success: true });
});

sequelize.authenticate()
  .then(() => app.listen(5002, () => console.log("Voting service running on port 5002")))
  .catch(err => console.error('DB Connection error:', err));
