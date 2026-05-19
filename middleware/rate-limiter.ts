import rateLimit, { RateLimitRequestHandler, MemoryStore } from "express-rate-limit";
import { Request, Response } from "express";

export const rateLimiter = (
	maxRequestsInOneMinute = 60,
): RateLimitRequestHandler => {
	return rateLimit({
		// Rate limiter configuration
		windowMs: 60 * 1000, // 1 minute
		max: maxRequestsInOneMinute,
		standardHeaders: false,
		legacyHeaders: false,
		store: new MemoryStore(),
		// Handle request in case limit is reached
		handler: async (
			request: Request,
			response: Response,
		) => {
			const respBody = {
				success: false,
				message: "Too Many Requests",
				detail: "Rate limit exceeded.",
				type: "tooManyRequests",
				code: 429,
			};
			response.status(429).send(respBody);
		},
	});
};
