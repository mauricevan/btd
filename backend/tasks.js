const Database = require('better-sqlite3');
const db = new Database('btd.sqlite');

// Ensure tasks table exists
const init = () => {
  db.prepare(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    userId INTEGER NOT NULL,
    pdfName TEXT,
    pdfUrl TEXT,
    status TEXT DEFAULT 'open',
    feedback TEXT
  )`).run();
};
init();

function getTasks() {
  return db.prepare('SELECT * FROM tasks').all();
}

function getTasksByUserId(userId) {
  return db.prepare('SELECT * FROM tasks WHERE userId = ?').all(userId);
}

function addTask(task) {
  const stmt = db.prepare(`INSERT INTO tasks (title, description, userId, pdfName, pdfUrl, status, feedback)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(
    task.title,
    task.description || '',
    task.userId,
    task.pdfName || null,
    task.pdfUrl || null,
    task.status || 'open',
    task.feedback || ''
  );
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
}

function updateTask(id, updates) {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return null;
  const updated = {
    ...task,
    ...updates
  };
  db.prepare(`UPDATE tasks SET title = ?, description = ?, userId = ?, pdfName = ?, pdfUrl = ?, status = ?, feedback = ? WHERE id = ?`).run(
    updated.title,
    updated.description,
    updated.userId,
    updated.pdfName,
    updated.pdfUrl,
    updated.status,
    updated.feedback,
    id
  );
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

function deleteTask(id) {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return true;
}

module.exports = {
  getTasks,
  getTasksByUserId,
  addTask,
  updateTask,
  deleteTask
}; 