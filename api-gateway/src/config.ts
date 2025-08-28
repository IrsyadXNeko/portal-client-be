import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    authService: process.env.AUTH_SERVICE_URL!,
    clientService: process.env.CLIENT_SERVICE_URL!,
    projectService: process.env.PROJECT_SERVICE_URL!,
    invoiceService: process.env.INVOICE_SERVICE_URL!,
    ticketService: process.env.TICKET_SERVICE_URL!,
    notificationService: process.env.NOTIFICATION_SERVICE_URL!,
    integrityService: process.env.INTEGRITY_SERVICE_URL!,
    jwtSecret: process.env.JWT_SECRET!
}