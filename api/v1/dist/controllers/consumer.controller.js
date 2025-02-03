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
exports.OrderHistory = exports.orderNow = exports.cartItem = exports.removeFromCart = exports.addToCart = exports.inventoryDetail = exports.refresh = exports.generateNewPassword = exports.verifyforgetMobileOTP = exports.verifyforgetEmailOTP = exports.generateForgetPasswordOTP = exports.changePassword = exports.verifyMobileOTP = exports.verifyTwofa = exports.Login = exports.signUp = void 0;
const ConsumerAuth = __importStar(require("../services/consumer.services"));
const ConsumerCart = __importStar(require("../services/consumer.services"));
const joi_1 = __importDefault(require("joi"));
const jquery_1 = require("jquery");
// SignUp
const signUp = async (req, res) => {
    const detail = req.body;
    try {
        const schema = joi_1.default.object({
            fname: joi_1.default.string().min(1).required(),
            mname: joi_1.default.string(),
            lname: joi_1.default.string().min(1).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            number: joi_1.default.number().min(10).required(),
            gender: joi_1.default.string().valid('M', 'F', 'O')
        });
        detail.gender = detail.gender.toUpperCase();
        const { error, value } = schema.validate(detail);
        if (error)
            throw error;
        else {
            const response = await ConsumerAuth.SignUp(detail);
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid Entries");
    }
};
exports.signUp = signUp;
const Login = async (req, res) => {
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
                const response = await ConsumerAuth.login(detail);
                res.status(201).send(response);
            }
        }
        else if (number !== undefined) {
            const { error } = numSchema.validate(detail);
            if (error)
                throw error;
            else {
                const response = await ConsumerAuth.login(detail);
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
exports.Login = Login;
// Verify Twofa
const verifyTwofa = async (req, res) => {
    try {
        const userDetail = req.body;
        const OTPschema = joi_1.default.object({
            otp: joi_1.default.number().required()
        });
        const { error } = OTPschema.validate(userDetail);
        if (error)
            throw error;
        else {
            const response = await ConsumerAuth.verifyTwofa(userDetail);
            res.status(201).send(response);
        }
    }
    catch (error) {
        res.status(401).send("Invalid OTP");
    }
};
exports.verifyTwofa = verifyTwofa;
const verifyMobileOTP = async (req, res) => {
    try {
        const userOTP = req.body;
        const schema = joi_1.default.object({
            otp: joi_1.default.number().required()
        });
        const { error } = schema.validate(userOTP);
        if (error)
            throw error;
        else {
            const response = await ConsumerAuth.verifyMobileOTP(userOTP.otp);
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
            const response = await ConsumerAuth.changePassword(uid, userPassDetail);
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
            const response = await ConsumerAuth.generateForgetPasswordOTP(req.body);
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
            otp: joi_1.default.number().required()
        });
        const { error } = schema.validate(req.body);
        if (error)
            throw error;
        else {
            console.log();
            const response = await ConsumerAuth.verifyforgetEmailOTP(req.body);
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
            otp: joi_1.default.number().required()
        });
        const { error } = schema.validate(req.body);
        if (error)
            throw error;
        else {
            const response = await ConsumerAuth.verifyforgetMobileOTP(req.body);
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
            const resposne = await ConsumerAuth.newPassword(req.body);
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
        const response = await ConsumerAuth.newToken(uid);
        res.status(201).send(response);
    }
    catch (error) {
        res.status(401).send("Invalid Request");
    }
};
exports.refresh = refresh;
// Order and Cart 
const inventoryDetail = async (req, res) => {
    try {
        const response = await ConsumerCart.inventory();
        res.status(201).send(response);
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid Request");
    }
};
exports.inventoryDetail = inventoryDetail;
// add
const addToCart = async (req, res) => {
    try {
        const uid = req.id;
        const cartDetail = req.body;
        const cartSchema = joi_1.default.object({
            brand: joi_1.default.string().min(1).required(),
            model: joi_1.default.string().min(1).required(),
            Quantity: joi_1.default.number().min(1)
        });
        if (jquery_1.error)
            throw jquery_1.error;
        else {
            const response = await ConsumerCart.addCart(uid, cartDetail);
            console.log(response);
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid entries");
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res) => {
    try {
        const itemDetail = req.body;
        const uid = req.id;
        const cartSchema = joi_1.default.object({
            brand: joi_1.default.string().min(1).required(),
            model: joi_1.default.string().min(1).required(),
            Quantity: joi_1.default.number().min(1)
        });
        const { error } = cartSchema.validate(itemDetail);
        if (error)
            throw error;
        else {
            const response = await ConsumerCart.removeCart(uid, itemDetail);
            console.log(response);
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send(error.message);
    }
};
exports.removeFromCart = removeFromCart;
const cartItem = async (req, res) => {
    try {
        const uid = req.id;
        const response = await ConsumerCart.getCartDetail(uid);
        res.status(201).send(response);
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send("Invalid Request");
    }
};
exports.cartItem = cartItem;
// order
const orderNow = async (req, res) => {
    try {
        const schema = joi_1.default.object({
            pincode: joi_1.default.number().required(),
            area: joi_1.default.string().required(),
            paymentMode: joi_1.default.valid('UPI', 'COD', 'CARD', 'NET BANKING', 'EMI').required()
        });
        const uid = req.id;
        const usrInfo = req.body;
        const { error } = schema.validate(usrInfo);
        if (error)
            throw error;
        else {
            const response = await ConsumerCart.buyNow(uid, usrInfo);
            res.status(201).send(response);
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(401).send(error.message);
    }
};
exports.orderNow = orderNow;
const OrderHistory = async (req, res) => {
    try {
        const response = await ConsumerCart.orderHistory(req.id);
        res.status(201).send(response);
    }
    catch (error) {
        res.status(401).send('Invalid request');
    }
};
exports.OrderHistory = OrderHistory;
//# sourceMappingURL=consumer.controller.js.map