import config from "../config/index.js"
import twilio from 'twilio'
import { GenerateOTP } from "./GenerateOTP.js";

// console.log(config.ACCOUNT_SID , config.AUTH_TOKEN); 

// ACCOUNT_SID : process.env.ACCOUNT_SID || 'AC42eddedcd4216871c4dd55279124e826',
// AUTH_TOKEN : process.env.AUTH_TOKEN || '50084d81a9cec713a6c4897dad497d59' ,  


const twilioClient = twilio('AC42eddedcd4216871c4dd55279124e826', '50084d81a9cec713a6c4897dad497d59');

export const sendOtpToMobile = async (mobileNumber : string , otp : number ) => {
    try {
        const mobileNumber1 =String('+' + 918299227068 )
        const message = await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`, // OTP message
            from: '+13613016030' ,// Twilio phone number
            to: mobileNumber1  , // User's mobile number
        });

        console.log(`OTP sent to ${mobileNumber}: Message SID - ${message.sid}`);
        // return "OTP has been sent to mobile number"
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        throw error.message
    }
};


// const otp = GenerateOTP();
// sendOtpToMobile('+918299227068', otp)  