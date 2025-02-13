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
exports.orderHistory = exports.buyNow = exports.getCartDetail = exports.removeCart = exports.addCart = exports.inventory = exports.newToken = exports.newPassword = exports.verifyforgetMobileOTP = exports.verifyforgetEmailOTP = exports.generateForgetPasswordOTP = exports.changePassword = exports.verifyTwofa = exports.verifyMobileOTP = exports.login = exports.SignUp = void 0;
const postgreConnection_1 = require("../utility/postgreConnection");
const js_sha512_1 = require("js-sha512");
const EmailOTP_1 = __importStar(require("../helper/EmailOTP"));
const GeneratToken_services_1 = require("../helper/GeneratToken.services");
const GenerateOTP_1 = require("../helper/GenerateOTP");
const mobileOtp_1 = require("../helper/mobileOtp");
const invoice_1 = require("../helper/invoice");
const config_1 = __importDefault(require("../config"));
const SignUp = async (userInfo) => {
    try {
        const userType = 'consumer';
        const { fname, mname, lname, email, password, number, gender } = userInfo;
        await postgreConnection_1.postgreConnection.query("BEGIN");
        const userExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL = $1 AND NUMBER = $2', [email, number]);
        // user doesn't exist
        if (userExist.rowCount === 0) {
            const hashedPass = (0, js_sha512_1.sha512)(password);
            if (mname === undefined) {
                const query = 'INSERT INTO USER_INFO (fname , lname , email , password , number , gender , created_at , user_type ) VALUES ($1 , $2 , $3 , $4  ,$5 , $6  ,now() ,$7)';
                const values = [fname, lname, email, hashedPass, number, gender || null, userType.toUpperCase()];
                await postgreConnection_1.postgreConnection.query(query, values);
            }
            else {
                const query = 'INSERT INTO USER_INFO (fname , mname , lname , email , password , number , gender , created_at , user_type) VALUES ($1 , $2 , $3 , $4  ,$5 , $6 ,$7 ,now() ,$8 )';
                const values = [fname, mname, lname, email, hashedPass, number, gender || null, userType.toUpperCase()];
                await postgreConnection_1.postgreConnection.query(query, values);
            }
            (0, EmailOTP_1.welcomeMail)('User', email, fname, lname);
            await postgreConnection_1.postgreConnection.query('COMMIT');
            return "successfully registered";
        }
        // user already exist
        else {
            await postgreConnection_1.postgreConnection.query('ROLLBACK');
            return 'user already exist';
        }
    }
    catch (error) {
        await postgreConnection_1.postgreConnection.query("ROLLBACK");
        return "invalid detail";
    }
};
exports.SignUp = SignUp;
const login = async (userinfo) => {
    try {
        const expiryTime = '10 minutes';
        const otp = await (0, GenerateOTP_1.GenerateOTP)();
        const { email, password, number } = userinfo;
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
                    await postgreConnection_1.postgreConnection.query(`UPDATE USER_INFO SET EMAIL_OTP = $1 , EMAILOTP_EXPIRY = NOW() +  INTERVAL '${expiryTime}' WHERE UID = $2`, [otp, id]);
                    await (0, EmailOTP_1.twofaMail)(email, otp, user_type);
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
            // user doesn't exist 
            else {
                return 'user doesn\'t exist';
            }
        }
        else if (number !== undefined) {
            const query = 'SELECT * FROM USER_INFO WHERE NUMBER = $1';
            const userExist = await postgreConnection_1.postgreConnection.query(query, [number]);
            if (userExist.rowCount > 0) {
                const uid = userExist.rows[0].uid;
                const num = '+' + String(918299227068);
                await postgreConnection_1.postgreConnection.query(`UPDATE USER_INFO SET MOBILE_OTP = $1, MOBILEOTP_EXPIRY = NOW() + INTERVAL '${expiryTime}' WHERE  UID = $2`, [otp, uid]);
                return await (0, mobileOtp_1.sendOtpToMobile)(num, otp);
            }
            else {
                return 'user doesn\'t exist';
            }
        }
    }
    catch (error) {
        return error;
    }
};
exports.login = login;
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
// Common for both seller and consumer
const verifyTwofa = async (userDetail) => {
    try {
        const { otp } = userDetail;
        const otpExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL_OTP = $1 AND EMAILOTP_EXPIRY > NOW()', [otp]);
        if (otpExist.rowCount > 0) {
            const { uid, fname, lname, email, user_type } = otpExist.rows[0];
            await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = $1  ,EMAILOTP_EXPIRY = NULL WHERE UID = $2', [null, uid]);
            await (0, EmailOTP_1.loginMail)(email, fname, lname, user_type);
            return await (0, GeneratToken_services_1.GenerateNewToken)(uid);
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
        return await (0, mobileOtp_1.sendOtpToMobile)(String('+' + number), otp);
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
        await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = NULL, EMAILOTP_EXPIRY = NULL WHERE UID = $1', [uid]);
        const secretKey = btoa(uid); // encode into BASE64
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
        await postgreConnection_1.postgreConnection.query('UPDATE USER_INFO SET MOBILE_OTP = NULL , MOBILEOTP_EXPIRY = NULL WHERE UID = $1', [uid]);
        const secretKey = btoa(uid); // encode into BASE64
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
const newToken = async (id) => {
    const newToken = await (0, GeneratToken_services_1.GenerateNewToken)(id);
    console.log(newToken);
    return newToken;
};
exports.newToken = newToken;
// Consumer Order and Cart
const inventory = async () => {
    try {
        const inventoryDetail = await postgreConnection_1.postgreConnection.query('SELECT PRODUCT_NAME , MODEL_NAME ,  BRAND_NAME , CATEGORY_NAME , fname  , lname FROM PRODUCT_DETAIL P JOIN CATEGORY C ON P.CAT_ID = C.ID JOIN USER_INFO U ON P.SID = U.UID');
        inventoryDetail.rows.forEach(each => {
            const sellername = each.fname + " " + each.lname;
            delete each.fname;
            delete each.lname;
            each["seller"] = sellername;
        });
        return inventoryDetail.rows;
    }
    catch (error) {
        return error;
    }
};
exports.inventory = inventory;
const addCart = async (uid, cartDetail) => {
    const { brand, model, Quantity } = cartDetail;
    const itemDetail = await postgreConnection_1.postgreConnection.query('SELECT * FROM PRODUCT_DETAIL  WHERE BRAND_NAME  = $1 and MODEL_NAME = $2 ', [brand, model]);
    if (itemDetail.rowCount > 0) {
        const productQuantity = Number(itemDetail.rows[0].quantity);
        const quantity = Quantity !== undefined ? Quantity : 1;
        if (productQuantity === 0)
            return 'out of stock';
        if (productQuantity - quantity >= 0) {
            const sno = itemDetail.rows[0].sno;
            const price = itemDetail.rows[0].total;
            const total = quantity * price;
            const values = [sno, uid, quantity, price, total];
            const cartExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM CART_DETAIL WHERE PID = $1 AND UID = $2', [sno, uid]);
            if (cartExist.rowCount > 0) {
                await postgreConnection_1.postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY - $1 WHERE SNO = $2', [quantity, sno]);
                await postgreConnection_1.postgreConnection.query('UPDATE CART_DETAIL SET QUANTITY = QUANTITY + $1 , TOTAL_PRICE = TOTAL_PRICE + $2 WHERE UID  = $3 AND PID =  $4', [quantity, total, uid, sno]);
            }
            else {
                await postgreConnection_1.postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY - $1 WHERE SNO = $2', [quantity, sno]);
                await postgreConnection_1.postgreConnection.query('INSERT INTO  CART_DETAIL ( PID , UID , QUANTITY , PRODUCT_PER_PRICE , TOTAL_PRICE)VALUES ($1 ,$2 ,$3,$4 , $5)', values);
            }
            return 'successfully added to cart';
        }
        else {
            return 'that much quantity not available';
        }
    }
    else {
        return 'no product found';
    }
};
exports.addCart = addCart;
const removeCart = async (uid, cartDetail) => {
    const { brand, model, Quantity } = cartDetail;
    const quantity = Quantity !== undefined ? Quantity : 1;
    const productInfo = await postgreConnection_1.postgreConnection.query('SELECT * FROM PRODUCT_DETAIL  WHERE BRAND_NAME  = $1 and MODEL_NAME = $2', [brand, model]);
    const cartItem = await postgreConnection_1.postgreConnection.query('SELECT * FROM CART_DETAIL WHERE UID = $1 ', [uid]);
    if (cartItem.rowCount > 0) {
        const sno = productInfo.rows[0].sno;
        const cartQuantity = (await postgreConnection_1.postgreConnection.query('SELECT * FROM CART_DETAIL WHERE PID = $1 AND UID = $2', [sno, uid])).rows[0];
        if (cartQuantity === undefined)
            throw new Error('user doesn\'t have that item in the cart');
        if (cartQuantity.quantity - quantity === 0) {
            const values = [sno, uid, quantity];
            await postgreConnection_1.postgreConnection.query('DELETE FROM CART_DETAIL WHERE PID = $1 AND UID = $2 AND QUANTITY = $3', values);
            await postgreConnection_1.postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY + $1 WHERE SNO = $2', [quantity, sno]);
            return 'removed successfully from cart';
        }
        else if (cartQuantity.quantity - quantity > 0) {
            await postgreConnection_1.postgreConnection.query('UPDATE CART_DETAIL SET QUANTITY = QUANTITY - $1 WHERE PID = $2 AND UID = $3', [quantity, sno, uid]);
            await postgreConnection_1.postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY + $1 WHERE SNO = $2', [quantity, sno]);
            return 'removed successfully from cart';
        }
        else if (cartQuantity.quantity - quantity < 0) {
            throw new Error('user doesn\'t contain that much item in the cart ');
        }
    }
    else {
        throw new Error('user doesn\'t have any  items in the cart');
    }
};
exports.removeCart = removeCart;
// cart Detail
const getCartDetail = async (uid) => {
    const cartExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM CART_DETAIL WHERE UID  = $1', [uid]);
    if (cartExist.rowCount > 0) {
        const cartDetail = (await postgreConnection_1.postgreConnection.query('SELECT P.PRODUCT_NAME  ,P.MODEL_NAME ,  P.BRAND_NAME , C.PRODUCT_PER_PRICE , C.QUANTITY , C.TOTAL_PRICE  FROM CART_DETAIL C JOIN PRODUCT_DETAIL P ON C.PID = P.SNO JOIN USER_INFO U ON C.UID = U.UID')).rows;
        return cartDetail;
    }
    else {
        return ' no item in cart';
    }
};
exports.getCartDetail = getCartDetail;
const userAddress = async (uid, area, pincode, pincodeExist) => {
    const city = pincodeExist.rows[0].city;
    const state = pincodeExist.rows[0].state;
    const country = pincodeExist.rows[0].country;
    const AddressExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM DELIVERY_ADDRESS WHERE UID = $1 AND AREA = $2', [uid, area]);
    if (AddressExist.rowCount === 0) {
        await postgreConnection_1.postgreConnection.query('INSERT INTO DELIVERY_ADDRESS (PINCODE , STATE , COUNTRY , CITY, AREA ,UID) VALUES ($1,$2,$3,$4,$5,$6)', [pincode, state, country, city, area, uid]);
        return [area, city, state, country];
    }
    else {
        const address = [AddressExist.rows[0].area, AddressExist.rows[0].city, AddressExist.rows[0].state, AddressExist.rows[0].country];
        return address;
    }
};
const cartTotalPrice = async (uid, paymentMode) => {
    const cartDetail = await postgreConnection_1.postgreConnection.query('SELECT * FROM CART_DETAIL WHERE UID = $1', [uid]);
    if (cartDetail.rowCount > 0) {
        const total_price = (await postgreConnection_1.postgreConnection.query('SELECT SUM(TOTAL_PRICE) FROM CART_DETAIL')).rows[0].sum;
        await postgreConnection_1.postgreConnection.query('INSERT INTO TRANSACTION_INFO (transaction_amount , transaction_type , uid ) values($1, $2, $3)', [total_price, paymentMode, uid]);
        return total_price;
    }
    else
        return 0;
};
const InvoiceGeneration = async (orderId, userInfo, seller, delivery_id, paymentMode) => {
    const userDetail = {};
    userDetail['company'] = userInfo[0].fname + " " + userInfo[0].lname;
    userDetail['address'] = delivery_id.area;
    userDetail['pincode'] = String(delivery_id.pincode);
    userDetail['city'] = delivery_id.city;
    userDetail['country'] = delivery_id.country;
    const cartDetail = [];
    seller.forEach(eachItem => {
        const eachObject = {};
        eachObject['quantity'] = String(Math.floor(eachItem.total_price / eachItem.product_per_price));
        eachObject['description'] = eachItem.model_name + " " + eachItem.brand_name;
        eachObject['tax'] = eachItem.gst;
        eachObject['price'] = eachItem.product_per_price;
        cartDetail.push(eachObject);
    });
    const DeliveryInfo = {
        number: `${String(orderId)}`, // Unique invoice number
        date: new Date().toISOString().slice(0, 10),
    };
    const sellerj = {
        company: "Br@ck",
        address: "City Mall",
        pincode: '20 cd ',
        city: "Gurugram",
        country: "India"
    };
    const consumerName = userDetail['company'];
    const paymentMethod = `Your payment mode is ${paymentMode}`;
    const invoicePath = await (0, invoice_1.createInvoice)(orderId, DeliveryInfo, userDetail, cartDetail, consumerName, sellerj, paymentMethod);
    const email = userInfo[0].email;
    await (0, EmailOTP_1.sendInvoice)(email, invoicePath);
};
const buyNow = async (uid, userInfo) => {
    try {
        await postgreConnection_1.postgreConnection.query('BEGIN');
        const { pincode, area, paymentMode } = userInfo;
        const pincodeExist = await postgreConnection_1.postgreConnection.query('SELECT * FROM PIN_ADD WHERE PINCODE = $1', [pincode]);
        if (pincodeExist.rowCount > 0) {
            const address = await userAddress(uid, area, pincode, pincodeExist);
            const cartTotal = await cartTotalPrice(uid, paymentMode);
            if (cartTotal === 0) {
                throw new Error('no items on the cart');
            }
            else {
                const deliveryTime = '15 days';
                const delivery_id = (await postgreConnection_1.postgreConnection.query('SELECT * FROM DELIVERY_ADDRESS D WHERE UID= $1 AND AREA =$2 ', [uid, area])).rows[0];
                const tid = (await postgreConnection_1.postgreConnection.query('SELECT * FROM TRANSACTION_INFO WHERE UID= $1 AND TRANSACTION_AMOUNT =$2', [uid, cartTotal])).rows[0].tid;
                const seller = (await postgreConnection_1.postgreConnection.query('SELECT * FROM CART_DETAIL C JOIN PRODUCT_DETAIL P ON C.PID = P.SNO JOIN USER_INFO U ON U.UID = P.SID')).rows;
                const userInfo = (await postgreConnection_1.postgreConnection.query('SELECT * FROM USER_INFO WHERE UID =$1', [uid])).rows;
                await postgreConnection_1.postgreConnection.query('INSERT INTO ORDERS (TID , UID , AMOUNT , DID ,ORDER_TIME) VALUES($1 ,$2 ,$3, $4 , NOW())', [tid, uid, cartTotal, delivery_id.did]);
                const orderId = (await postgreConnection_1.postgreConnection.query('SELECT * FROM ORDERS  WHERE UID  = $1 AND DID = $2 AND TID = $3', [uid, delivery_id.did, tid])).rows[0];
                await InvoiceGeneration(orderId.oid, userInfo, seller, delivery_id, paymentMode);
                await postgreConnection_1.postgreConnection.query(`INSERT INTO TRACKING_DETAIL (DELIVERY_PARTNER , DELIVERY_STATUS , OID, UID ,ORDER_DATE , DELIVERY_DATE ) VALUES ($1 , $2 ,$3 ,$4 , NOW() , NOW() + INTERVAL '${deliveryTime}' )`, [config_1.default.deliveryPartner[1], config_1.default.deliveryStatus[0], orderId.oid, uid]);
                const trackId = (await postgreConnection_1.postgreConnection.query('SELECT * FROM TRACKING_DETAIL WHERE OID = $1 AND UID =$2', [orderId.oid, uid])).rows[0];
                await postgreConnection_1.postgreConnection.query('INSERT INTO ORDER_HISTORY (oid , uid , track_id)    VALUES ($1 , $2 , $3)', [orderId.oid, uid, trackId.sno]);
                await postgreConnection_1.postgreConnection.query('DELETE FROM CART_DETAIL WHERE UID = $1', [uid]);
                // await postgreConnection.query('ROLLBACK') 
            }
            await postgreConnection_1.postgreConnection.query('COMMIT');
            return 'invoice has been sent to your mail';
        }
        else {
            throw new Error('wrong pincode');
        }
    }
    catch (error) {
        await postgreConnection_1.postgreConnection.query('ROLLBACK');
        throw error;
    }
};
exports.buyNow = buyNow;
const orderHistory = async (uid) => {
    const orders = (await postgreConnection_1.postgreConnection.query('SELECT OH.OID , DELIVERY_PARTNER , DELIVERY_STATUS , ORDER_DATE , DELIVERY_DATE , AREA , CITY , STATE , COUNTRY , PINCODE , TRANSACTION_TYPE , TRANSACTION_AMOUNT FROM ORDER_HISTORY OH  JOIN ORDERS O ON O.OID = OH.OID JOIN TRACKING_DETAIL T ON OH.TRACK_ID = T.SNO join DELIVERY_ADDRESS D ON D.DID = O.DID JOIN TRANSACTION_INFO TR ON TR.TID = O.TID WHERE OH.UID = $1', [uid])).rows;
    console.log(orders);
    return orders;
};
exports.orderHistory = orderHistory;
//# sourceMappingURL=consumer.services.js.map