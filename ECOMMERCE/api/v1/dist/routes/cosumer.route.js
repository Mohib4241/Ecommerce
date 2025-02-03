"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consumer_auth_route_1 = __importDefault(require("./consumer.auth.route"));
const consumer_cart_route_1 = __importDefault(require("./consumer.cart.route"));
const consumer_order_route_1 = __importDefault(require("./consumer.order.route"));
// import 
const router = express_1.default.Router();
router.use('/auth', consumer_auth_route_1.default);
router.use('/inventory', consumer_cart_route_1.default);
router.use('/order', consumer_order_route_1.default);
exports.default = router;
//# sourceMappingURL=cosumer.route.js.map