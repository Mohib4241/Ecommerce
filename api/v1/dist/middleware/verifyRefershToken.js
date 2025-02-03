"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefresh = void 0;
const postgreConnection_1 = require("../utility/postgreConnection");
const index_1 = __importDefault(require("../config/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyRefresh = async (req, res, next) => {
    try {
        const refreshToken = req.headers.authorization;
        const TokenExist = (await postgreConnection_1.postgreConnection.query('select * from session where refresh  = $1', [refreshToken]));
        if (TokenExist.rowCount > 0) {
            const token = jsonwebtoken_1.default.verify(refreshToken, index_1.default.key);
            if (token) {
                req.id = token.id;
            }
            next();
        }
        else {
            res.status(401).send('your session logged out');
        }
    }
    catch (error) {
        res.status(401).send('Refresh Token Expired');
    }
};
exports.verifyRefresh = verifyRefresh;
//# sourceMappingURL=verifyRefershToken.js.map