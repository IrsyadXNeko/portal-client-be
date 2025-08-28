import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "../config";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public
router.use(createProxyMiddleware({ target: config.authService, changeOrigin: true }));

// Protected
router.use(authMiddleware, createProxyMiddleware({ target: config.clientService, changeOrigin: true }));
router.use(authMiddleware, createProxyMiddleware({ target: config.projectService, changeOrigin: true }));
router.use(authMiddleware, createProxyMiddleware({ target: config.invoiceService, changeOrigin: true }));
router.use(authMiddleware, createProxyMiddleware({ target: config.ticketService, changeOrigin: true }));
router.use(authMiddleware, createProxyMiddleware({ target: config.notificationService, changeOrigin: true }));
router.use(authMiddleware, createProxyMiddleware({ target: config.integrityService, changeOrigin: true }));

export default router;