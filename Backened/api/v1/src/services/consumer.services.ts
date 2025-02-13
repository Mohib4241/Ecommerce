import { postgreConnection } from "../utility/postgreConnection";
import { sha512 } from "js-sha512";
import  forgetPasswordMail, { loginMail, twofaMail, welcomeMail  , sendInvoice} from "../helper/EmailOTP";
import { GenerateNewToken } from "../helper/GeneratToken.services";
import { GenerateOTP } from "../helper/GenerateOTP";
import { sendOtpToMobile } from "../helper/mobileOtp";
import {createInvoice} from '../helper/invoice'
import config from "../config";
import { Images } from "../helper/productImages";

declare global{
    namespace easyinvoice{
        interface information {
            orderDate?  : string,
            deliveryDate? :string,
        }   
    }
}


interface userInfo {
    fname : string,
    mname : string | undefined,
    lname : string, 
    email : string, 
    password : string,
    number : number,
    gender : string | undefined

}


export const SignUp = async (userInfo : userInfo) => {
    
    try{
        const userType = 'consumer'
        const {fname , mname , lname , email , password , number , gender } = userInfo
        await postgreConnection.query("BEGIN")
        const userExist = await postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL = $1 AND NUMBER = $2' 
            ,[email , number])

            // user doesn't exist
        if(userExist.rowCount === 0){
            const hashedPass = sha512(password)
            if(mname === undefined){

                const query = 
                'INSERT INTO USER_INFO (fname , lname , email , password , number , gender , created_at , user_type ) VALUES ($1 , $2 , $3 , $4  ,$5 , $6  ,now() ,$7)'
                const values = [fname , lname , email , hashedPass , number , gender || null , userType.toUpperCase()] 
                await postgreConnection.query(query  , values)
            }

            else{
                const query = 
                'INSERT INTO USER_INFO (fname , mname , lname , email , password , number , gender , created_at , user_type) VALUES ($1 , $2 , $3 , $4  ,$5 , $6 ,$7 ,now() ,$8 )'
                const values = [fname , mname , lname , email , hashedPass , number , gender  || null  , userType.toUpperCase()] 
                await postgreConnection.query(query , values)
            }

            welcomeMail('User' , email ,fname , lname)
            await postgreConnection.query('COMMIT')
            return "successfully registered"
        }

        // user already exist
        else{
            await postgreConnection.query('ROLLBACK')
            throw 'user already exist'
        }


    }
    catch(error){
        await postgreConnection.query("ROLLBACK");
        throw  "invalid detail"
    }

}

export const login = async(userinfo) => {

    try{
        const expiryTime = '10 minutes'
        const otp = await GenerateOTP()
        const {email , password , number} = userinfo
        // login from email and password
        if(email !== undefined && password !== undefined){
            const hashedPass = sha512(password)
            const query = 'SELECT * FROM USER_INFO WHERE EMAIL = $1 AND PASSWORD = $2'
            const userExist = await postgreConnection.query(query , [email , hashedPass])
            // user exist
            if(userExist.rowCount > 0) {
                const twofa = userExist.rows[0].twofa
                const id = userExist.rows[0].uid
                    const {fname , lname , user_type} = userExist.rows[0]

                    if(twofa == 'YES' ){
                        // otp send to your mail
                        await postgreConnection.query(`UPDATE USER_INFO SET EMAIL_OTP = $1 , EMAILOTP_EXPIRY = NOW() +  INTERVAL '${expiryTime}' WHERE UID = $2`,[otp  , id])
                        twofaMail(email , otp , user_type)
                        return 'OTP has been sent to your mail'
                    }

                    else {  
                        // twofa not set
                        const id = userExist.rows[0].uid
                        const token = await  GenerateNewToken(id)
                        loginMail(email ,  fname ,  lname , user_type)
                        return token
                    }

              }   
            // user doesn't exist 
            else{
                return 'user doesn\'t exist'
            }
            
        }
        else if(number !== undefined) {
            const query = 'SELECT * FROM USER_INFO WHERE NUMBER = $1'
            const userExist = await postgreConnection.query(query , [number])

            if(userExist.rowCount > 0){
                const uid = userExist.rows[0].uid
                    const num = '+'+String(918299227068)
                   await postgreConnection.query(`UPDATE USER_INFO SET MOBILE_OTP = $1, MOBILEOTP_EXPIRY = NOW() + INTERVAL '${expiryTime}' WHERE  UID = $2`,[otp,uid])
                   sendOtpToMobile(num , otp)
                   return "OTP has been sent to mobile number"
                }

                else{
                    return 'user doesn\'t exist'
                }
            }
        }

    catch(error){
        throw error
    }

}

// verifying mobile otp for login
export const verifyMobileOTP = async(otp : number) => {
        try{
            const sellerExist = await postgreConnection.query('SELECT * FROM USER_INFO WHERE MOBILE_OTP = $1 AND MOBILEOTP_EXPIRY > NOW()' 
                ,[otp])
    
            if(sellerExist.rowCount > 0 ){
                const uid = sellerExist.rows[0].uid
                return await GenerateNewToken(uid)
            }
            else{
                return 'otp expired'
            }
        }   
        catch(err)
        {
            return err
        }
    }

// Common for both seller and consumer
export const verifyTwofa = async(userDetail) =>{

    try{
        const {otp} = userDetail
        const otpExist = await postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL_OTP = $1 AND EMAILOTP_EXPIRY > NOW()',[otp])
        if(otpExist.rowCount > 0){
            const {uid  , fname , lname , email , user_type } = otpExist.rows[0]
            await postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = $1  ,EMAILOTP_EXPIRY = NULL WHERE UID = $2',[null, uid])
            loginMail(email , fname , lname , user_type)
            return await GenerateNewToken(uid) 
        }
        else{
            return 'otp expired'
        }

    }   
    catch(error){
        console.log("ererer");
        return error
    }

}

export const changePassword = async(uid , Pass) =>{

    const {oldPassword , newPassword , confirmPassword} = Pass;
    const hashedPass = sha512(oldPassword)
    const passExist = await postgreConnection.query('SELECT * FROM USER_INFO WHERE UID = $1 AND PASSWORD = $2',
        [uid , hashedPass])
    // old password exist with the user one
    if(passExist.rowCount > 0 ){
        
        if(newPassword === confirmPassword){
           const newHashPass = sha512(newPassword)
           await postgreConnection.query('UPDATE USER_INFO SET PASSWORD = $1 WHERE UID = $2',[newHashPass , uid])
           return 'password successfully changed' 
        }   
        else{
            return 'confirm password doesn\'t  matched'
        }
    }

    else{
        return 'old password doesn\t matched'
    }

}

// forget Password
export const generateForgetPasswordOTP = async( userOTP) => {
    const {email , number} = userOTP
    const expiryTime = '10 minutes'
    const otp = await GenerateOTP()
    const emailUID = await postgreConnection.query('SELECT UID FROM USER_INFO WHERE EMAIL = $1',[email])
    const numUID = await postgreConnection.query('SELECT UID FROM USER_INFO WHERE NUMBER = $1',[number])

    if(email !== undefined && emailUID.rowCount > 0){
        const uid = emailUID.rows[0].uid
        await postgreConnection.query(`UPDATE USER_INFO SET EMAIL_OTP = $1 , EMAILOTP_EXPIRY = NOW() + INTERVAL '${expiryTime}' WHERE UID = $2` ,[otp, uid])
        await forgetPasswordMail(email , otp)
        return 'OTP has been sent to your mail'
    }

    else if(number !== undefined && numUID.rowCount > 0){
        const uid = numUID.rows[0].uid
        await postgreConnection.query(`UPDATE USER_INFO SET MOBILE_OTP = $1 , MOBILEOTP_EXPIRY = NOW() + INTERVAL '${expiryTime}' WHERE UID = $2` ,[otp, uid])
        return await sendOtpToMobile(String('+' + number), otp)
    
    }
    else{
        return 'invalid entries'
    }
}


export const verifyforgetEmailOTP = async (userOTP) => {
    const { otp } = userOTP 
    const otpValid = await postgreConnection.query('SELECT UID FROM USER_INFO WHERE EMAIL_OTP = $1 AND EMAILOTP_EXPIRY > NOW()',[otp])
    if(otpValid.rowCount > 0){
        const uid = otpValid.rows[0].uid
        await postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = NULL, EMAILOTP_EXPIRY = NULL WHERE UID = $1',[uid])
        const secretKey = btoa(uid) // encode into BASE64
        return `OTP has been matched and Your Secret Key is ${secretKey}`
    }
    else{
        return 'OTP doesn\'t matched'
    }

}

export const verifyforgetMobileOTP = async (userOTP) => {
    const { otp } = userOTP 
    const otpValid = await postgreConnection.query('SELECT UID FROM USER_INFO WHERE MOBILE_OTP = $1 and MOBILEOTP_EXPIRY > NOW()',[otp])
    if(otpValid.rowCount > 0){
        const uid = otpValid.rows[0].uid
        await postgreConnection.query('UPDATE USER_INFO SET MOBILE_OTP = NULL , MOBILEOTP_EXPIRY = NULL WHERE UID = $1',[uid])  
        const secretKey = btoa(uid) // encode into BASE64
        return `OTP has been matched and Your Secret Key is ${secretKey}`
    }
    else{
        return 'OTP doesn\'t matched'
    }

}

export const newPassword = async(newPass) =>{

    const{secretKey  , newPassword , confirmPassword  } = newPass
    const id = atob(secretKey) // decoding it into id
    const userExist = await postgreConnection.query('SELECT * FROM USER_INFO WHERE UID = $1',[id])
    if(userExist.rowCount > 0  ){
        if(newPassword === confirmPassword){
            const hashedPass = sha512(newPassword)
            await postgreConnection.query('UPDATE USER_INFO SET PASSWORD = $1 WHERE UID = $2',[hashedPass , id])
            return 'new password successfully set'
        }
        else{
            return 'confirm password doesn\'t matched'
        }
    }
    else{
        return 'wrong secret key'
    }

}

export const newToken  = async(id : number ,refreshToken : string) => {  

        const newToken  = await GenerateNewToken(id)
        return newToken
}

// Consumer Order and Cart

export const inventory = async() => {
    
    try{
        const inventoryDetail = await postgreConnection.query
        ('SELECT PRODUCT_NAME , MODEL_NAME ,  BRAND_NAME , CATEGORY_NAME , fname  , lname , total  FROM PRODUCT_DETAIL P JOIN CATEGORY C ON P.CAT_ID = C.ID JOIN USER_INFO U ON P.SID = U.UID')
        
        inventoryDetail.rows.forEach(each => {
            const img = Images.find(img => img.hasOwnProperty(each.product_name)) 
            console.log(img); 
            if(img )
                each['img'] = img[each.product_name]

            const sellername = each.fname + " " + each.lname
            delete each.fname
            delete each.lname
        
            each["seller"] = sellername
        })
        console.log(inventoryDetail.rows);
        return inventoryDetail.rows
    }
    catch(error){
        return error
    }
}

export const addCart = async(uid , cartDetail) =>{
    
    const {brand , model , Quantity} = cartDetail
    const itemDetail = await postgreConnection.query
    ('SELECT * FROM PRODUCT_DETAIL  WHERE BRAND_NAME  = $1 and MODEL_NAME = $2 ',[brand , model])
    if(itemDetail.rowCount > 0 ){
        const productQuantity = Number(itemDetail.rows[0].quantity)
        const quantity = Quantity !== undefined ? Quantity : 1
        if(productQuantity === 0)
            return 'out of stock'

        if( productQuantity - quantity >= 0){
            const sno = itemDetail.rows[0].sno
            const price = itemDetail.rows[0].total
            const total = quantity * price
            const values = [sno , uid , quantity , price , total]
            const cartExist  = await postgreConnection.query('SELECT * FROM CART_DETAIL WHERE PID = $1 AND UID = $2',[sno , uid])
                if(cartExist.rowCount > 0) {
                    await postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY - $1 WHERE SNO = $2' ,[quantity , sno])
                    await postgreConnection.query('UPDATE CART_DETAIL SET QUANTITY = QUANTITY + $1 , TOTAL_PRICE = TOTAL_PRICE + $2 WHERE UID  = $3 AND PID =  $4',[quantity , total , uid , sno])
                }
                else {
                    await postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY - $1 WHERE SNO = $2' ,[quantity , sno])
                    await postgreConnection.query('INSERT INTO  CART_DETAIL ( PID , UID , QUANTITY , PRODUCT_PER_PRICE , TOTAL_PRICE)VALUES ($1 ,$2 ,$3,$4 , $5)', 
                    values )
                }
            return 'successfully added to cart'
        }
        else{
            return 'that much quantity not available'
        }

    }
    else{
        return 'no product found'
    }

}

export const removeCart = async(uid , cartDetail)=>{

    const {brand , model , Quantity} = cartDetail
    const quantity = Quantity !== undefined ? Quantity : 1

    const productInfo = await postgreConnection.query('SELECT * FROM PRODUCT_DETAIL  WHERE BRAND_NAME  = $1 and MODEL_NAME = $2',[brand , model ])
    const cartItem = await postgreConnection.query ('SELECT * FROM CART_DETAIL WHERE UID = $1 ',[uid])
    if(cartItem.rowCount > 0 ){
        const sno = productInfo.rows[0].sno
        const cartQuantity = (await postgreConnection.query('SELECT * FROM CART_DETAIL WHERE PID = $1 AND UID = $2',[sno , uid])).rows[0]
        if(cartQuantity===undefined)
            throw new Error('user doesn\'t have that item in the cart')



        if(cartQuantity.quantity - quantity === 0 ){
            const values = [sno , uid , quantity]
            await postgreConnection.query('DELETE FROM CART_DETAIL WHERE PID = $1 AND UID = $2 AND QUANTITY = $3', 
                values )
            await postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY + $1 WHERE SNO = $2' ,[quantity , sno])  
            return 'removed successfully from cart'

        }   
        
        else if(cartQuantity.quantity - quantity > 0){
            await postgreConnection.query('UPDATE CART_DETAIL SET QUANTITY = QUANTITY - $1 WHERE PID = $2 AND UID = $3',
                [quantity , sno , uid])
            await postgreConnection.query('UPDATE PRODUCT_DETAIL SET QUANTITY = QUANTITY + $1 WHERE SNO = $2' ,[quantity , sno])  
            return 'removed successfully from cart'
            
        } 
        else if(cartQuantity.quantity - quantity < 0){
            throw new Error( 'user doesn\'t contain that much item in the cart ')
        }


    }
    else{
        throw new Error( 'user doesn\'t have any  items in the cart')
    }

}

// cart Detail
export const getCartDetail = async(uid)=>  {
    
    const cartExist = await postgreConnection.query('SELECT * FROM CART_DETAIL WHERE UID  = $1',[uid])

    if(cartExist.rowCount > 0){
        const cartDetail =( await postgreConnection.query('SELECT P.PRODUCT_NAME  ,P.MODEL_NAME ,  P.BRAND_NAME , C.PRODUCT_PER_PRICE , C.QUANTITY , C.TOTAL_PRICE  FROM CART_DETAIL C JOIN PRODUCT_DETAIL P ON C.PID = P.SNO JOIN USER_INFO U ON C.UID = U.UID')).rows
        return cartDetail
    }
    else{
        return ' no item in cart'
    }
}


// orderNow 

interface location {
    city : string,
    country : string,
    state : string,
    pincode : string
}

const userAddress = async(uid , area , pincode, pincodeExist) =>{
    const city = pincodeExist.rows[0].city 
    const state = pincodeExist.rows[0].state
    const country = pincodeExist.rows[0].country
    const AddressExist = await postgreConnection.query('SELECT * FROM DELIVERY_ADDRESS WHERE UID = $1 AND AREA = $2',[uid , area])

    if(AddressExist.rowCount === 0){
        await postgreConnection.query('INSERT INTO DELIVERY_ADDRESS (PINCODE , STATE , COUNTRY , CITY, AREA ,UID) VALUES ($1,$2,$3,$4,$5,$6)',
            [pincode , state , country , city, area , uid ])
            return  [area ,city , state ,  country]
    }
    else{
        const address = [AddressExist.rows[0].area ,  AddressExist.rows[0].city , AddressExist.rows[0].state , AddressExist.rows[0].country]
        return address
    }
}

const cartTotalPrice = async(uid , paymentMode) => {
    const cartDetail = await postgreConnection.query('SELECT * FROM CART_DETAIL WHERE UID = $1',[uid])
    if(cartDetail.rowCount > 0){
        const total_price = (await postgreConnection.query('SELECT SUM(TOTAL_PRICE) FROM CART_DETAIL')).rows[0].sum
        await postgreConnection.query('INSERT INTO TRANSACTION_INFO (transaction_amount , transaction_type , uid ) values($1, $2, $3)',[total_price ,paymentMode,uid])
        return total_price
    }
    else 
        return 0
}

const InvoiceGeneration = async(orderId, userInfo , seller ,delivery_id, paymentMode )=> {
    const userDetail = {}

     userDetail['company'] = userInfo[0].fname + " " + userInfo[0].lname
     userDetail['address'] = delivery_id.area
     userDetail['pincode'] = String(delivery_id.pincode)
     userDetail['city'] = delivery_id.city
     userDetail['country'] = delivery_id.country



    const cartDetail = []
    seller.forEach(eachItem => {
        const eachObject = {}
        eachObject['quantity'] = String(Math.floor(eachItem.total_price / eachItem.product_per_price ) )
        eachObject['description'] = eachItem.model_name +" "+ eachItem.brand_name
        eachObject['tax'] = eachItem.gst
        eachObject['price'] = eachItem.product_per_price
        cartDetail.push(eachObject)
    })
    const  DeliveryInfo =  {
        number: `${String(orderId)}`, // Unique invoice number
        date: new Date().toISOString().slice(0, 10),
    }
    const sellerj = {
        company : "Br@ck",
        address  : "City Mall",
        pincode : '20 cd ',
        city : "Gurugram",
        country : "India"
    }


     const consumerName = userDetail['company']
     const paymentMethod = `Your payment mode is ${paymentMode}`
     const invoicePath =  await createInvoice(orderId ,DeliveryInfo  , userDetail ,cartDetail ,consumerName , sellerj , paymentMethod)
     const email = userInfo[0].email
     sendInvoice(email , invoicePath)

}

export const buyNow = async (uid , userInfo) =>{

try{
    await postgreConnection.query('BEGIN')
    const {pincode , area , paymentMode}  = userInfo
    const pincodeExist = await postgreConnection.query('SELECT * FROM PIN_ADD WHERE PINCODE = $1',[pincode])
    if(pincodeExist.rowCount > 0){
        
        const address = await userAddress(uid , area , pincode ,pincodeExist)
       const cartTotal = await  cartTotalPrice(uid , paymentMode)
        if(cartTotal === 0){
            throw new Error( 'no items on the cart' )
        }

        else{
            const deliveryTime = '15 days'
            const delivery_id = (await postgreConnection.query('SELECT * FROM DELIVERY_ADDRESS D WHERE UID= $1 AND AREA =$2 ',[uid , area])).rows[0]
            const tid = (await postgreConnection.query('SELECT * FROM TRANSACTION_INFO WHERE UID= $1 AND TRANSACTION_AMOUNT =$2',[uid , cartTotal])).rows[0].tid
            const seller  = (await postgreConnection.query('SELECT * FROM CART_DETAIL C JOIN PRODUCT_DETAIL P ON C.PID = P.SNO JOIN USER_INFO U ON U.UID = P.SID')).rows
            const userInfo =(await postgreConnection.query('SELECT * FROM USER_INFO WHERE UID =$1',[uid])).rows
            await postgreConnection.query('INSERT INTO ORDERS (TID , UID , AMOUNT , DID ,ORDER_TIME) VALUES($1 ,$2 ,$3, $4 , NOW())',
                [tid , uid , cartTotal , delivery_id.did])
            
            const orderId = (await postgreConnection.query('SELECT * FROM ORDERS  WHERE UID  = $1 AND DID = $2 AND TID = $3',[uid , delivery_id.did , tid])).rows[0]
            InvoiceGeneration(orderId.oid ,userInfo , seller , delivery_id , paymentMode)

            await postgreConnection.query(`INSERT INTO TRACKING_DETAIL (DELIVERY_PARTNER , DELIVERY_STATUS , OID, UID ,ORDER_DATE , DELIVERY_DATE ) VALUES ($1 , $2 ,$3 ,$4 , NOW() , NOW() + INTERVAL '${deliveryTime}' )`,
                [config.deliveryPartner[1] ,config.deliveryStatus[0] , orderId.oid , uid ])
            const trackId = (await postgreConnection.query('SELECT * FROM TRACKING_DETAIL WHERE OID = $1 AND UID =$2',[orderId.oid , uid])).rows[0];
            await postgreConnection.query('INSERT INTO ORDER_HISTORY (oid , uid , track_id)    VALUES ($1 , $2 , $3)' ,[ orderId.oid ,uid , trackId.sno])
       
            await postgreConnection.query('DELETE FROM CART_DETAIL WHERE UID = $1',[uid])
            await postgreConnection.query('ROLLBACK') 
        }
        await postgreConnection.query('COMMIT')


        return 'invoice has been sent to your mail'
    }
    else{
        throw new Error( 'wrong pincode' )
    }
    }
    catch(error){
        await postgreConnection.query('ROLLBACK')
        throw error
    }
}

export const orderHistory = async(uid ) => {

    const orders = (await postgreConnection.query('SELECT OH.OID , DELIVERY_PARTNER , DELIVERY_STATUS , ORDER_DATE , DELIVERY_DATE , AREA , CITY , STATE , COUNTRY , PINCODE , TRANSACTION_TYPE , TRANSACTION_AMOUNT FROM ORDER_HISTORY OH  JOIN ORDERS O ON O.OID = OH.OID JOIN TRACKING_DETAIL T ON OH.TRACK_ID = T.SNO join DELIVERY_ADDRESS D ON D.DID = O.DID JOIN TRANSACTION_INFO TR ON TR.TID = O.TID WHERE OH.UID = $1',[uid])).rows
    console.log(orders);
    return orders
}