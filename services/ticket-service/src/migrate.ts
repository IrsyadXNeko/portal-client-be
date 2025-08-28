import { db } from "./database";

export async function migrate() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS bwpc_tickets (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL,
        subject VARCHAR(100) NOT NULL,
        status VARCHAR(10) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bwpc_ticket_messages (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL,
        sender_role VARCHAR(10) NOT NULL CHECK (sender_role IN ('client', 'admin')),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Ticket tables migrated');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
}