import { db } from './database';

export async function migrate() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS pc_projects (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      status VARCHAR(20) CHECK (status IN ('waiting', 'in_progress', 'completed', 'cancelled')) DEFAULT 'waiting',
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS pc_project_progress (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tables created successfully');
}
