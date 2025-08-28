import { db } from "src/database";

export async function generateRecurringInvoices() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const res = await db.query(
            'SELECT * FROM pc_invoices WHERE is_recurring = true AND due_date = $1',
            [today],
        );

        for (const invoice of res.rows) {
            const nextDueDate = getNextDueDate(invoice.due_date, invoice.recurring_interval);

            await db.query(
                `INSERT INTO pc_invoices (client_id, title, description, amount, due_date, is_recurring, recurring_interval)
         VALUES ($1, $2, $3, $4, $5, true, $6)`,
                [
                    invoice.client_id,
                    invoice.title,
                    invoice.description,
                    invoice.amount,
                    nextDueDate,
                    invoice.recurring_interval,
                ],
            );
        };
        console.log(`✅ Recurring invoices generated (${res.rowCount})`);
    } catch (err) {
        console.error('❌ Error generating recurring invoices', err);
    }
}

function getNextDueDate(current: string, interval: 'monthly' | 'yearly') {
    const date = new Date(current);
    if (interval === 'monthly') date.setMonth(date.getMonth() + 1);
    else if (interval === 'yearly') date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
}