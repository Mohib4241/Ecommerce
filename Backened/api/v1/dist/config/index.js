"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    PORT: Number(process.env.PORT),
    key: process.env.key,
    Username: process.env.username,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    PortDB: Number(process.env.PortdB),
    ACCOUNT_SID: process.env.ACCOUNT_SID || 'AC42eddedcd4216871c4dd55279124e826',
    AUTH_TOKEN: process.env.AUTH_TOKEN || '50084d81a9cec713a6c4897dad497d59',
    NUMBER: process.env.Number || '+918299227068',
    senderMail: 'mohib829942@gmail.com',
    passEmail: process.env.PassEmail || 'nizowfwgenxdnaew',
    deliveryStatus: ['PROCESSED', 'SHIPPED', 'IN TRANSIT', 'OUT FOR DELIVERY', 'DELIVERED', 'UNDELIVERED'],
    deliveryPartner: ['Shiprocket', 'Ekart', 'Ecom']
};
//# sourceMappingURL=index.js.map