"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgreConnection = void 0;
exports.fetch = fetch;
const pg_1 = __importDefault(require("pg"));
const index_1 = __importDefault(require("../config/index"));
const { Pool } = pg_1.default;
exports.postgreConnection = new Pool({
    user: index_1.default.Username, // Your PostgreSQL username
    host: index_1.default.host, // Hostname (localhost or server IP)
    database: index_1.default.database, // Database name
    password: index_1.default.password, // Your PostgreSQL password
    port: index_1.default.PortDB,
});
async function fetch() {
    const todo_data = (await exports.postgreConnection.query('select * from user_info'));
    // console.log(await postgreConnection.query('select * from cart_detail'))
    // console.log(await postgreConnection.query('select * from transaction_info'));
    // console.log(await postgreConnection.query('select * from order_history'));
    console.log(await exports.postgreConnection.query('select * from product_detail'));
    // const user_detail =  await postgreConnection.query('select * from cart_detail')
    // console.log( todo_data);
    // console.log(user_detail);
}
//# sourceMappingURL=postgreConnection.js.map