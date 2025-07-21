// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) console.error("Failed to connect to DB:", err);
  else console.log("✅ Connected to SQLite database.");
});

// Create student biodata table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    username TEXT,
    email TEXT UNIQUE,
    contact TEXT,
    password TEXT
  )
`);

module.exports = db;
