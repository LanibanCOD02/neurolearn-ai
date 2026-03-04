import Database from 'better-sqlite3';
const db = new Database('neurolearn.db');
const insert = db.prepare('INSERT INTO assessments (user_id, user_email, question_id, prompt, answer, evaluation_json) VALUES (?, ?, ?, ?, ?, ?)');
const info = insert.run(2, 'jane@neurolearn.com', 'test-q-1', 'Describe overfitting', 'Overfitting is when a model fits training data too closely...', JSON.stringify({ overall: 75, feedback: ['Good explanation', 'Add example'] }));
console.log('Inserted id', info.lastInsertRowid);
