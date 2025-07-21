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

// ✅ Add Student (Insert only name and age)
app.post('/api/students', (req, res) => {
  const { firstName, lastName, username, email, contact, password } = req.body;

  db.get("SELECT * FROM students WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (row) return res.status(400).json({ message: "Student already exists" });

    db.run(`
      INSERT INTO students (firstName, lastName, username, email, contact, password)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, username, email, contact, password], // unhashed for demo
      function (err) {
        if (err) return res.status(500).json({ message: "Insert error", error: err });
        res.json({ message: "Student inserted", id: this.lastID });
      }
    );
  });
});

// ✅ Get All Students
app.get('/api/students', (req, res) => {
  db.all("SELECT id, firstName, lastName, email, contact FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(rows);
  });
});

// Update a student
app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, username, email, contact, password } = req.body;

  db.run(`
    UPDATE students SET firstName = ?, lastName = ?, username = ?, email = ?, contact = ?, password = ?
    WHERE id = ?
  `, [firstName, lastName, username, email, contact, password, id], function (err) {
    if (err) return res.status(500).json({ message: "Update error", error: err });
    res.json({ message: "Student updated successfully" });
  });
});


// Delete a student
// Example using Express
app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM students WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ message: "Delete failed", error: err });
    res.json({ message: "Deleted successfully" });
  });
});



