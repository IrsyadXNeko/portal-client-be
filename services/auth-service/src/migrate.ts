import { db } from './database';

export async function migrate() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS pc_users (
      id SERIAL PRIMARY KEY,
      role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'client')),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      force_password_change BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ auth-service: pc_users table migrated');
}
