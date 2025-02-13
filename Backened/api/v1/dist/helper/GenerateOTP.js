"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOTP = void 0;
const GenerateOTP = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
};
exports.GenerateOTP = GenerateOTP;
//# sourceMappingURL=GenerateOTP.js.map