"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = exports.newPassword = exports.verifyforgetMobileOTP = exports.verifyforgetEmailOTP = exports.generateForgetPasswordOTP = exports.changePassword = exports.verifyMobileOTP = exports.verifyTwofa = exports.loginSeller = exports.SignUp = void 0;
const postgreConnection_1 = require("../utility/postgreConnection");
const EmailOTP_1 = __importStar(require("../helper/EmailOTP"));
const js_sha512_1 = require("js-sha512");
const GenerateOTP_1 = require("../helper/GenerateOTP");
const GeneratToken_services_1 = require("../helper/GeneratToken.services");
const mobileOtp_1 = require("../helper/mobileOtp");
// Seller SignUP
const SignUp = async (signUpDetail) => {
    const { fname, mname, lname, email, password, number, gender, companyName, companyAdd, gstNo } = signUpDetail;
    try {
        await postgreConnection_1.postgreConnection.query('BEGIN');
        const userType = 'seller';
        const sellerExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL = $1 AND NUMBER = $2', [email, number]);
        // seller doesn't exist
        if (sellerExist.rowCount === 0) {
            const hashedPass = (0, js_sha512_1.sha512)(password);
            console.log(mname);
            const query = 'INSERT INTO USER_INFO (fname , mname  , lname ,email ,password , number , gender , created_at , user_type , company_name , company_add , gstno ) VALUES ($1 , $2 , $3 , $4  ,$5 , $6 ,$7 ,now() ,$8 , $9 , $10 , $11 ) ';
            const values = [fname || null, mname || null, lname || null, email, hashedPass, number, gender.toUpperCase() || null, userType.toUpperCase(), companyName, companyAdd, gstNo];
            await postgreConnection_1.postgreConnection.query(query, values);
            await (0, EmailOTP_1.welcomeMail)('Seller', email, companyName, lname);
            await postgreConnection_1.postgreConnection.query('COMMIT');
            return "successfully registered";
        }
        // seller already exist
        else {
            return 'seller already exist';
        }
    }
    catch (error) {
        await postgreConnection_1.postgreConnection.query('ROLLBACK');
        return "vdzgdf";
    }
};
exports.SignUp = SignUp;
const loginSeller = async (sellerDetail) => {
    try {
        const otp = await (0, GenerateOTP_1.GenerateOTP)();
        const { email, password, number } = sellerDetail;
        // login from email and password
        if (email !== undefined && password !== undefined) {
            const hashedPass = (0, js_sha512_1.sha512)(password);
            const query = 'SELECT * FROM USER_INFO WHERE EMAIL = $1 AND PASSWORD = $2';
            const userExist = await postgreConnection_1.postgreConnection.query(query, [email, hashedPass]);
            // user exist
            if (userExist.rowCount > 0) {
                const twofa = userExist.rows[0].twofa;
                const id = userExist.rows[0].uid;
                const { fname, lname, user_type } = userExist.rows[0];
                if (twofa == 'YES') {
                    // otp send to your mail
                    await (0, EmailOTP_1.twofaMail)(email, otp, user_type);
                    const expiryTime = '10 minutes';
                    await postgreConnection_1.postgreConnection.query(`UPDATE USER_INFO SET EMAIL_OTP = $1 , EMAILOTP_EXPIRY = NOW() +  INTERVAL '${expiryTime}' WHERE UID = $2`, [otp, id]);
                    return 'OTP has been sent to your mail';
                }
                else {
                    // twofa not set
                    const id = userExist.rows[0].uid;
                    const token = await (0, GeneratToken_services_1.GenerateNewToken)(id);
                    await (0, EmailOTP_1.loginMail)(email, fname, lname, user_type);
                    return token;
                }
            }
        }
        else if (number !== undefined) {
            const query = 'SELECT * FROM USER_INFO WHERE NUMBER = $1';
            const userExist = await postgreConnection_1.postgreConnection.query(query, [number]);
            if (userExist.rowCount > 0) {
                const num = '+' + String(918299227068);
                return await (0, mobileOtp_1.sendOtpToMobile)(num, otp);
            }
            else {
                return 'seller doesn\'t exist';
            }
        }
        else {
            return 'invlaid entries';
        }
    }
    catch (error) {
        return error;
    }
};
exports.loginSeller = loginSeller;
// verify Twofa using email
const verifyTwofa = async (userDetail) => {
    try {
        const { otp } = userDetail;
        const otpExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL_OTP = $1 AND EMAILOTP_EXPIRY > NOW()', [otp]);
        if (otpExist.rowCount > 0) {
            const id = otpExist.rows[0].uid;
            await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = $1  ,EMAILOTP_EXPIRY = NULL WHERE UID = $2', [null, id]);
            return await (0, GeneratToken_services_1.GenerateNewToken)(id);
        }
        else {
            return 'otp expired';
        }
    }
    catch (error) {
        console.log("ererer");
        return error;
    }
};
exports.verifyTwofa = verifyTwofa;
// verifying mobile otp for login
const verifyMobileOTP = async (otp) => {
    try {
        const sellerExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE MOBILE_OTP = $1 AND MOBILEOTP_EXPIRY > NOW()', [otp]);
        if (sellerExist.rowCount > 0) {
            const uid = sellerExist.rows[0].uid;
            return await (0, GeneratToken_services_1.GenerateNewToken)(uid);
        }
        else {
            return 'otp expired';
        }
    }
    catch (err) {
        return err;
    }
};
exports.verifyMobileOTP = verifyMobileOTP;
const changePassword = async (uid, Pass) => {
    const { oldPassword, newPassword, confirmPassword } = Pass;
    const hashedPass = (0, js_sha512_1.sha512)(oldPassword);
    const passExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE UID = $1 AND PASSWORD = $2', [uid, hashedPass]);
    // old password exist with the user one
    if (passExist.rowCount > 0) {
        if (newPassword === confirmPassword) {
            const newHashPass = (0, js_sha512_1.sha512)(newPassword);
            await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET PASSWORD = $1 WHERE UID = $2', [newHashPass, uid]);
            return 'password successfully changed';
        }
        else {
            return 'confirm password doesn\'t  matched';
        }
    }
    else {
        return 'old password doesn\t matched';
    }
};
exports.changePassword = changePassword;
// forget Password
const generateForgetPasswordOTP = async (userOTP) => {
    const { email, number } = userOTP;
    const expiryTime = '10 minutes';
    const otp = await (0, GenerateOTP_1.GenerateOTP)();
    const emailUID = await postgreConnection_1.postgreConnection.query('SELECT UID FROM USER_INFO WHERE EMAIL = $1', [email]);
    const numUID = await postgreConnection_1.postgreConnection.query('SELECT UID FROM USER_INFO WHERE NUMBER = $1', [number]);
    if (email !== undefined && emailUID.rowCount > 0) {
        const uid = emailUID.rows[0].uid;
        await postgreConnection_1.postgreConnection.query(`UPDATE USER_INFO SET EMAIL_OTP = $1 , EMAILOTP_EXPIRY = NOW() + INTERVAL '${expiryTime}' WHERE UID = $2`, [otp, uid]);
        await (0, EmailOTP_1.default)(email, otp);
        return 'OTP has been sent to your mail';
    }
    else if (number !== undefined && numUID.rowCount > 0) {
        const uid = numUID.rows[0].uid;
        await postgreConnection_1.postgreConnection.query(`UPDATE USER_INFO SET MOBILE_OTP = $1 , MOBILEOTP_EXPIRY = NOW() + INTERVAL '${expiryTime}' WHERE UID = $2`, [otp, uid]);
        await (0, mobileOtp_1.sendOtpToMobile)(String('+' + number), otp);
        return 'OTP has been sent to your mobile number';
    }
    else {
        return 'invalid entries';
    }
};
exports.generateForgetPasswordOTP = generateForgetPasswordOTP;
const verifyforgetEmailOTP = async (userOTP) => {
    const { otp } = userOTP;
    const otpValid = await postgreConnection_1.postgreConnection.query('SELECT UID FROM USER_INFO WHERE EMAIL_OTP = $1 AND EMAILOTP_EXPIRY > NOW()', [otp]);
    if (otpValid.rowCount > 0) {
        const uid = otpValid.rows[0].uid;
        const secretKey = btoa(uid); // encode into BASE64\
        await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = NULL , EMAILOTP_EXPIRY = NULL WHERE UID = $1', [uid]);
        return `OTP has been matched and Your Secret Key is ${secretKey}`;
    }
    else {
        return 'OTP doesn\'t matched';
    }
};
exports.verifyforgetEmailOTP = verifyforgetEmailOTP;
const verifyforgetMobileOTP = async (userOTP) => {
    const { otp } = userOTP;
    const otpValid = await postgreConnection_1.postgreConnection.query('SELECT UID FROM USER_INFO WHERE MOBILE_OTP = $1 and MOBILEOTP_EXPIRY > NOW()', [otp]);
    if (otpValid.rowCount > 0) {
        const uid = otpValid.rows[0].uid;
        const secretKey = btoa(uid); // encode into BASE64
        await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET MOBILE_OTP = NULL , MOBILEOTP_EXPIRY = NULL WHERE UID = $1', [uid]);
        return `OTP has been matched and Your Secret Key is ${secretKey}`;
    }
    else {
        return 'OTP doesn\'t matched';
    }
};
exports.verifyforgetMobileOTP = verifyforgetMobileOTP;
const newPassword = async (newPass) => {
    const { secretKey, newPassword, confirmPassword } = newPass;
    const id = atob(secretKey); // decoding it into id
    const userExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE UID = $1', [id]);
    if (userExist.rowCount > 0) {
        if (newPassword === confirmPassword) {
            const hashedPass = (0, js_sha512_1.sha512)(newPassword);
            await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET PASSWORD = $1 WHERE UID = $2', [hashedPass, id]);
            return 'new password successfully set';
        }
        else {
            return 'confirm password doesn\'t matched';
        }
    }
    else {
        return 'wrong secret key';
    }
};
exports.newPassword = newPassword;
// generating new token through refresh token
const newToken = async (id) => {
    const newToken = await (0, GeneratToken_services_1.GenerateNewToken)(id);
    return newToken;
};
exports.newToken = newToken;
//# sourceMappingURL=seller.services.js.map