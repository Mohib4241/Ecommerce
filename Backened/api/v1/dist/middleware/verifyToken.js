"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const postgreConnection_1 = require("../utility/postgreConnection");
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    try {
        const secretKey = config_1.default.key;
        const token = req.headers.authorization;
        const decode = jsonwebtoken_1.default.verify(token, secretKey);
        req.id = decode.id;
        const id = req.id;
        const userValidId = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE UID = $1', [id]);
        if (userValidId.rowCount > 0) {
            next();
        }
        else {
            res.status(401).send("Invalid Token as user doesn\'t matched");
        }
    }
    catch (error) {
        res.status(401).send("Token Expired");
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map