const express = require('express');
const bcrypt = require('bcrypt');
const sequelize = require('../shared/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  Username: { type: DataTypes.STRING, unique: true, allowNull: false },
  PasswordHash: { type: DataTypes.STRING, allowNull: false },
  DeviceIp: { type: DataTypes.STRING },
  LastLogin: { type: DataTypes.DATE }
}, { tableName: 'Users', timestamps: false });

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password, device_ip } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ Username: username, PasswordHash: passwordHash, DeviceIp: device_ip, LastLogin: new Date() });
    res.json({ id: user.Id, username: user.Username });
  } catch (e) {
    res.status(400).json({ error: 'User already exists or invalid data.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password, device_ip } = req.body;
  const user = await User.findOne({ where: { Username: username } });
  if (user && await bcrypt.compare(password, user.PasswordHash)) {
    user.DeviceIp = device_ip;
    user.LastLogin = new Date();
    await user.save();
    res.json({ id: user.Id, username: user.Username });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

sequelize.authenticate()
  .then(() => app.listen(5000, () => console.log("User service running on port 5000")))
  .catch(err => console.error('DB Connection error:', err));
