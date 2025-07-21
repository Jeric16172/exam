// Simple in-memory stores
const users = {};      // { email: { email, password } }
const sessions = {};   // { token: email }

module.exports = { users, sessions };
