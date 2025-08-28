import axios from "axios";
import { Request, Response } from "express";
import { ResponseHelper } from "./utils/response.helper";

export async function proxyRequest(req: Request, res: Response, targetUrl: string) {
    try {
        const response = await axios({
            method: req.method as any,
            url: `${targetUrl}${req.url}`,
            data: req.body,
            headers: {
                ...req.headers,
                'x-request-id': req.headers['x-request-id'],
            },
        });

        res.status(response.status).json(response.data);
    } catch (err: any) {
        console.error(`[${req.headers['x-request-id']}] ❌ Proxy Error`, err.message);
        res.status(500).json(ResponseHelper.error({ message: 'Gateway Error', errors: err.message }));
    }
}