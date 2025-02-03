"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpToMobile = void 0;
const twilio_1 = __importDefault(require("twilio"));
// console.log(config.ACCOUNT_SID , config.AUTH_TOKEN); 
// ACCOUNT_SID : process.env.ACCOUNT_SID || 'AC42eddedcd4216871c4dd55279124e826',
// AUTH_TOKEN : process.env.AUTH_TOKEN || '50084d81a9cec713a6c4897dad497d59' ,  
const twilioClient = (0, twilio_1.default)('AC42eddedcd4216871c4dd55279124e826', '50084d81a9cec713a6c4897dad497d59');
const sendOtpToMobile = async (mobileNumber, otp) => {
    try {
        const mobileNumber1 = String('+' + 918299227068);
        const message = await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`, // OTP message
            from: '+13613016030', // Twilio phone number
            to: mobileNumber1, // User's mobile number
        });
        console.log(`OTP sent to ${mobileNumber}: Message SID - ${message.sid}`);
        return "OTP has been sent to mobile number";
    }
    catch (error) {
        console.error('Error sending OTP:', error.message);
        return error.message;
    }
};
exports.sendOtpToMobile = sendOtpToMobile;
// const otp = GenerateOTP();
// sendOtpToMobile('+918299227068', otp)  
//# sourceMappingURL=mobileOtp.js.map