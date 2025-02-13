import config from "../config"
import twilio from 'twilio'


const twilioClient = twilio(config.ACCOUNT_SID, config.AUTH_TOKEN);

export const sendOtpToMobile = async (mobileNumber : string , otp : number ) => {
    try {
        const mobileNumber1 =String(config.NUMBER )
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
