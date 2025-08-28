import { db } from "./database";

export async function migrate() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS pc_invoices (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        amount NUMERIC(12,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
        due_date DATE NOT NULL,
        paid_at TIMESTAMP,
        is_recurring BOOLEAN DEFAULT FALSE,
        recurring_interval VARCHAR(10) CHECK (recurring_interval IN ('monthly', 'yearly')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Invoice table migrated');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
}