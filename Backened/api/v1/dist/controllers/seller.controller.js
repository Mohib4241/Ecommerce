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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.generateNewPassword = exports.verifyforgetMobileOTP = exports.verifyforgetEmailOTP = exports.generateForgetPasswordOTP = exports.changePassword = exports.verifyMobileOTP = exports.twoFa = exports.loginSeller = exports.signUpSeller = void 0;
const sellerServices = __importStar(require("../services/seller.services"));
const joi_1 = __importDefault(require("joi"));
// Sign Up User
const signUpSeller = async (req, res) => {
    try {
        const sellerSignUpDetail = req.body;
        const sellerSchema = joi_1.default.object({
            fname: joi_1.default.string(),
            mname: joi_1.default.string(),
            lname: joi_1.default.string(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            number: joi_1.default.number().min(10).required(),
            gender: joi_1.default.string().valid('M', 'F', 'O', 'm', 'f', 'o'),
            companyName: joi_1.default.string().min(3).required(),
            companyAdd: joi_1.default.string().min(4).required(),
            gstNo: joi_1.default.string().required()
        });
        const { error } = sellerSchema.validate(sellerSignUpDetail);
        if (error)
            throw error;
        else {
            const response = await sellerServices.SignUp(sellerSignUpDetail);
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid Entries");
    }
};
exports.signUpSeller = signUpSeller;
// Login Seller
const loginSeller = async (req, res) => {
    const detail = req.body;
    const { email, password, number } = detail;
    try {
        const emailSchema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required()
        });
        const numSchema = joi_1.default.object({
            number: joi_1.default.number().required()
        });
        if (email !== undefined && password !== undefined) {
            const { error } = emailSchema.validate(detail);
            if (error)
                throw error;
            else {
                const response = await sellerServices.loginSeller(detail);
                res.status(201).send(response);
            }
        }
        else if (number !== undefined) {
            const { error } = numSchema.validate(detail);
            if (error)
                throw error;
            else {
                const response = await sellerServices.loginSeller(detail);
                if (response === error)
                    throw error;
                res.status(201).send(response);
            }
        }
        else {
            throw "e";
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid entries");
    }
};
exports.loginSeller = loginSeller;
const twoFa = async (req, res) => {
    try {
        const userDetail = req.body;
        const OTPschema = joi_1.default.object({
            otp: joi_1.default.number().min(6).required()
        });
        const { error } = OTPschema.validate(userDetail);
        if (error)
            throw error;
        else {
            const response = await sellerServices.verifyTwofa(userDetail);
            res.status(201).send(response);
        }
    }
    catch (error) {
        res.status(401).send("Invalid OTP");
    }
};
exports.twoFa = twoFa;
const verifyMobileOTP = async (req, res) => {
    try {
        const sellerOTP = req.body;
        const schema = joi_1.default.object({
            otp: joi_1.default.number().min(6).required()
        });
        const { error } = schema.validate(sellerOTP);
        if (error)
            throw error;
        else {
            const response = await sellerServices.verifyMobileOTP(sellerOTP.otp);
            res.status(201).send(response);
        }
    }
    catch (err) {
        console.log(err);
        res.status(201);
    }
};
exports.verifyMobileOTP = verifyMobileOTP;
const changePassword = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            oldPassword: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            newPassword: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            confirmPassword: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required()
        });
        const userPassDetail = req.body;
        const uid = req.id;
        const { error } = schema.validate(userPassDetail);
        if (error)
            throw error;
        else {
            const response = await sellerServices.changePassword(uid, userPassDetail);
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid Request");
    }
};
exports.changePassword = changePassword;
const generateForgetPasswordOTP = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email(),
            number: joi_1.default.number().min(7)
        });
        const { error } = schema.validate(req.body);
        if (error)
            throw error;
        else {
            const response = await sellerServices.generateForgetPasswordOTP(req.body);
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid request");
    }
};
exports.generateForgetPasswordOTP = generateForgetPasswordOTP;
const verifyforgetEmailOTP = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            otp: joi_1.default.number().min(6).max(6).required()
        });
        const { error } = schema.validate(req.body);
        if (error)
            throw error;
        else {
            const response = await sellerServices.verifyforgetEmailOTP(req.body);
            if (response === 'OTP doesn\'t matched')
                throw "OTP doesn\'t matched";
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        if (error === 'OTP doesn\'t matched')
            res.status(401).send(error);
        else
            res.status(401).send("Invalid Entries");
    }
};
exports.verifyforgetEmailOTP = verifyforgetEmailOTP;
const verifyforgetMobileOTP = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            otp: joi_1.default.number().min(6).max(6).required()
        });
        const { error } = schema.validate(req.body);
        if (error)
            throw error;
        else {
            const response = await sellerServices.verifyforgetMobileOTP(req.body);
            if (response === 'OTP doesn\'t matched')
                throw "OTP doesn\'t matched";
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        if (error === 'OTP doesn\'t matched')
            res.status(401).send(error);
        else
            res.status(401).send("Invalid Entries");
    }
};
exports.verifyforgetMobileOTP = verifyforgetMobileOTP;
const generateNewPassword = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            secretKey: joi_1.default.string().required(),
            newPassword: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            confirmPassword: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required()
        });
        const { error } = schema.validate(req.body);
        if (error)
            throw error;
        else {
            const resposne = await sellerServices.newPassword(req.body);
            res.status(201).send(resposne);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid Access Key");
    }
};
exports.generateNewPassword = generateNewPassword;
const refresh = async (req, res) => {
    try {
        const uid = req.id;
        const response = await sellerServices.newToken(uid);
        res.status(201).send(response);
    }
    catch (error) {
        res.status(401).send("Invalid Request");
    }
};
exports.refresh = refresh;
// export const addInventory  = async() 
//# sourceMappingURL=seller.controller.js.map