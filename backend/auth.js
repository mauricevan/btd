const Database = require('better-sqlite3');
const db = new Database('btd.sqlite');

// Ensure users table exists
const init = () => {
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`).run();
  // Seed admin and customer if table is empty
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (count === 0) {
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run('admin@btd.nl', 'admin123', 'admin');
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run('klant@btd.nl', 'klant123', 'customer');
  }
};
init();

let currentUser = null;

function login(email, password) {
  const user = db.prepare('SELECT id, email, role FROM users WHERE email = ? AND password = ?').get(email, password);
  if (user) {
    currentUser = user;
    return user;
  }
  return null;
}

function register(email, password) {
  try {
    const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    const info = stmt.run(email, password, 'customer');
    const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(info.lastInsertRowid);
    currentUser = user;
    return user;
  } catch (e) {
    return null;
  }
}

function getCurrentUser() {
  return currentUser;
}

function getUsers() {
  return db.prepare('SELECT id, email, role FROM users').all();
}

function updateUser(id, updates) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return null;
  const email = updates.email || user.email;
  const role = updates.role || user.role;
  const password = updates.password ? updates.password : user.password;
  db.prepare('UPDATE users SET email = ?, password = ?, role = ? WHERE id = ?').run(email, password, role, id);
  return db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(id);
}

function deleteUser(id) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  if (currentUser && currentUser.id === id) currentUser = null;
  return true;
}

module.exports = {
  login,
  register,
  getCurrentUser,
  getUsers,
  updateUser,
  deleteUser
}; 