const express = require('express');
const sequelize = require('../shared/db');
const { DataTypes } = require('sequelize');

const Contestant = sequelize.define('Contestant', {
  Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  Name: { type: DataTypes.STRING, allowNull: false },
  ImageUrl: { type: DataTypes.STRING },
  Week: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Contestants', timestamps: false });

const app = express();
app.use(express.json());

app.get('/contestants', async (req, res) => {
  const week = req.query.week || 1;
  const contestants = await Contestant.findAll({ where: { Week: week } });
  res.json(contestants);
});

// Admin endpoint to update weekly contestants
app.post('/contestants', async (req, res) => {
  const { contestants, week } = req.body;
  if (!Array.isArray(contestants) || !week) return res.status(400).json({ error: "Invalid data" });
  await Contestant.destroy({ where: { Week: week } });
  for (const c of contestants) {
    await Contestant.create({ Name: c.name, ImageUrl: c.imageUrl, Week: week });
  }
  res.json({ success: true });
});

sequelize.authenticate()
  .then(() => app.listen(5001, () => console.log("Contestant service running on port 5001")))
  .catch(err => console.error('DB Connection error:', err));
