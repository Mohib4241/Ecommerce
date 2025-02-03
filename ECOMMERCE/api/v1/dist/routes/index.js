"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cosumer_route_1 = __importDefault(require("./cosumer.route"));
const admin_route_1 = __importDefault(require("./admin.route"));
const seller_route_1 = __importDefault(require("./seller.route"));
const ratelimiter_1 = __importDefault(require("../middleware/ratelimiter"));
const router = express_1.default.Router();
router.use('/consumer', (0, ratelimiter_1.default)(2000, 1), cosumer_route_1.default);
router.use('/admin', (0, ratelimiter_1.default)(2000, 1), admin_route_1.default);
router.use('/seller', (0, ratelimiter_1.default)(3000, 2), seller_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map