import Database from 'better-sqlite3';
const db = new Database('neurolearn.db');
const rows = db.prepare('SELECT id, user_email, question_id, prompt, answer, evaluation_json, comments_json, created_at FROM assessments ORDER BY created_at DESC').all();
console.log(JSON.stringify(rows, null, 2));
