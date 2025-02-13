"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateNewToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const postgreConnection_1 = require("../utility/postgreConnection");
const GenerateNewToken = async (id) => {
    const options = {
        algorithm: "HS512",
        expiresIn: "30min",
    };
    const payload = {
        id: id,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, index_1.default.key, options);
    const refreshToken = jsonwebtoken_1.default.sign(payload, index_1.default.key, { expiresIn: "3d" });
    try {
        const TokenExist = await postgreConnection_1.postgreConnection.query("select * from session where uid = $1", [id]);
        if (TokenExist.rowCount === 0) {
            await postgreConnection_1.postgreConnection.query("INSERT INTO SESSION (ACCESS , REFRESH , UID ) VALUES  ( $1 ,  $2 , $3 ) on conflict do nothing", [accessToken, refreshToken, id]);
        }
        else {
            await postgreConnection_1.postgreConnection.query("update session set access = $1 , refresh = $2 where uid = $3", [accessToken, refreshToken, id]);
            return { accessToken, refreshToken };
        }
        return { accessToken, refreshToken };
    }
    catch (error) {
        return error;
    }
};
exports.GenerateNewToken = GenerateNewToken;
//# sourceMappingURL=GeneratToken.services.js.map