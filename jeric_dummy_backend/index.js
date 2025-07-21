const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const sessions = {}; // in-memory sessions

// ✅ Register
app.post('/api/register', (req, res) => {
  const { firstName, lastName, username, email, contact, password } = req.body;

  db.get("SELECT * FROM students WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (row) return res.status(400).json({ message: "User already exists" });

    // 🔐 Hash password
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) return res.status(500).json({ message: "Hash error", error: err });

      db.run(`
        INSERT INTO students (firstName, lastName, username, email, contact, password)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, username, email, contact, hash],
        function (err) {
          if (err) return res.status(500).json({ message: "Insert error", error: err });
          res.json({ message: "Registered successfully", id: this.lastID });
        }
      );
    });
  });
});


// ✅ Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM students WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 🔐 Compare password with hash
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) return res.status(401).json({ message: "Invalid credentials" });

      const token = `${email}-${Date.now()}`;
      sessions[token] = email;

      res.json({ token });
    });
  });
});


// ✅ Profile
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization;
  const email = sessions[token];

  if (!email) return res.status(401).json({ message: "Unauthorized" });

  db.get("SELECT * FROM students WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ profile: user });
  });
});

// ✅ Status
app.get('/api/status', (req, res) => {
  res.json({ status: 'Dummy backend with SQLite running' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
