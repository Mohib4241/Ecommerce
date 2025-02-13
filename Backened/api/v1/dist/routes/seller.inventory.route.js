"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.use(verifyToken_1.verifyToken);
router.post('/addProduct');
router.post('');
exports.default = router;
//# sourceMappingURL=seller.inventory.route.js.map