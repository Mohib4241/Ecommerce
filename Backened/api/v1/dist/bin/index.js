"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../config/index"));
const index_2 = __importDefault(require("../routes/index"));
const app = (0, express_1.default)();
const port = index_1.default.PORT;
app.use(express_1.default.json());
app.use('/api/v1', index_2.default);
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map