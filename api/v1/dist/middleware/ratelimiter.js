"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
const ratelimiter = (windowSize = 1000, maxRequest = 1) => {
    return (0, express_rate_limit_1.rateLimit)({
        windowMs: windowSize, // 15 minutes
        limit: maxRequest, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        message: 'Too many requests'
    });
    // next()
};
// Apply the rate limiting middleware to all requests.
exports.default = ratelimiter;
//# sourceMappingURL=ratelimiter.js.map