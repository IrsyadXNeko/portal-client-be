import { db } from './database';

export async function migrate() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS pc_clients (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      company_name VARCHAR(100),
      contact_person VARCHAR(100),
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS pc_biodata_update_requests (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL,
      new_company_name VARCHAR(100),
      new_contact_person VARCHAR(100),
      new_phone VARCHAR(20),
      new_address TEXT,
      status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ client-service: tables migrated');
}