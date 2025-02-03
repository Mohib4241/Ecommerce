"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const seller_auth_route_1 = __importDefault(require("./seller.auth.route"));
const seller_inventory_route_1 = __importDefault(require("./seller.inventory.route"));
exports.router = express_1.default.Router();
exports.router.use('/auth', seller_auth_route_1.default);
exports.router.use('/inventory', seller_inventory_route_1.default);
exports.default = exports.router;
//# sourceMappingURL=seller.route.js.map