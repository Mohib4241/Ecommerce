import { postgreConnection } from "../utility/postgreConnection";
import forgetPasswordMail , { welcomeMail , twofaMail , loginMail }from "../helper/EmailOTP";
import { sha512 } from "js-sha512";
import { GenerateOTP } from "../helper/GenerateOTP";
import { GenerateNewToken } from "../helper/GeneratToken.services";
import { sendOtpToMobile } from "../helper/mobileOtp";
import { inventory } from "./consumer.services";
import { inventoryDetail } from "src/controllers/consumer.controller";
import { error } from "jquery";


interface sellerInfo {
    fname : string | undefined ,
    mname : string | undefined ,
    lname : string | undefined ,
   companyName : string,
    companyAdd : string,
    gstNo : string,
    email : string, 
    password : string,
    number : number,
    gender : string | undefined

}

// Seller SignUP

export const SignUp = async (signUpDetail : sellerInfo) =>{
  
    const{fname , mname , lname ,  email , password , number , gender  , companyName , companyAdd , gstNo } = signUpDetail
    try{
        await postgreConnection.query('BEGIN')
        const userType = 'seller'
        const sellerExist = await postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL = $1 AND NUMBER = $2',[email , number])

        // seller doesn't exist
        if(sellerExist.rowCount === 0 ){
            const hashedPass = sha512(password)
            console.log(mname);
            const query = 
            'INSERT INTO USER_INFO (fname , mname  , lname ,email ,password , number , gender , created_at , user_type , company_name , company_add , gstno ) VALUES ($1 , $2 , $3 , $4  ,$5 , $6 ,$7 ,now() ,$8 , $9 , $10 , $11 ) '
            const values = [fname || null ,mname || null , lname || null, email , hashedPass , number , gender.toUpperCase() || null , userType.toUpperCase() , companyName , companyAdd , gstNo] 
          
            await postgreConnection.query(query  , values)
            await welcomeMail('Seller' ,email ,companyName , lname)
            await postgreConnection.query('COMMIT')
            return "successfully registered"
            }
            // seller already exist
        else{  
            return 'seller already exist'
            }
    }

    catch(error){
        await postgreConnection.query('ROLLBACK')
        return "vdzgdf"
    }
}


// Login

interface loginDetail{
    email? : string,
    password? : string,
    number? : number
}
export const loginSeller = async(sellerDetail) => {
    try{
        const otp = await GenerateOTP()
        const expiryTime = '10 minutes'
        const {email , password , number} = sellerDetail
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
                        twofaMail(email , otp , user_type)
                        await postgreConnection.query(`UPDATE USER_INFO SET EMAIL_OTP = $1 , EMAILOTP_EXPIRY = NOW() +  INTERVAL '${expiryTime}' WHERE UID = $2`,[otp  , id])
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
            }  
            
        else if(number !== undefined) {
            const query = 'SELECT * FROM USER_INFO WHERE NUMBER = $1'
            const userExist = await postgreConnection.query(query , [number])

            if(userExist.rowCount > 0){
                const uid = userExist.rows[0].uid
                const num = '+'+String(918299227068)
                await postgreConnection.query(`UPDATE USER_INFO SET MOBILE_OTP = $1, MOBILEOTP_EXPIRY = NOW() + INTERVAL '${expiryTime}' WHERE  UID = $2`,[otp,uid])
                sendOtpToMobile(num , otp)
                return  'OTP has been sent to your mobile number'
                }

                else{
                    return 'seller doesn\'t exist'
                }
            }
            else{
                return 'invlaid entries'
            }
    }
     catch(error){
        return error
    }
}

// verify Twofa using email
export const verifyTwofa = async(userDetail) => {

    try{
        const {otp} = userDetail
        const otpExist = await postgreConnection.query('SELECT * FROM USER_INFO WHERE EMAIL_OTP = $1 AND EMAILOTP_EXPIRY > NOW()',[otp])
        if(otpExist.rowCount > 0){
            const id  = otpExist.rows[0].uid
            await postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = $1  ,EMAILOTP_EXPIRY = NULL WHERE UID = $2',[null, id])
            return await GenerateNewToken(id) 
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

// verifying mobile otp for login
export const verifyMobileOTP = async(otp) => 
{
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


export const changePassword = async(uid , Pass) =>{

    const {oldPassword , newPassword , confirmPassword} = Pass
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
        await sendOtpToMobile(String('+'+number), otp)
        return 'OTP has been sent to your mobile number'
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
        const secretKey = btoa(uid) // encode into BASE64\
        await postgreConnection.query('UPDATE USER_INFO SET EMAIL_OTP = NULL , EMAILOTP_EXPIRY = NULL WHERE UID = $1',[uid])  
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
        const secretKey = btoa(uid) // encode into BASE64
        await postgreConnection.query('UPDATE USER_INFO SET MOBILE_OTP = NULL , MOBILEOTP_EXPIRY = NULL WHERE UID = $1',[uid])  
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

// generating new token through refresh token
export const newToken  = async(id : number) => {  
    const newToken  = await GenerateNewToken(id)
    return newToken
}

export const addInventory = async(uid ,inventoryDetail ) => {

    var {product , brand , price , quantity , model ,  category , manufacturedIn , warranty , idealFor} = inventoryDetail
    const cat = category.toUpperCase()
    manufacturedIn = manufacturedIn !== undefined ? manufacturedIn : 'India'
    warranty = warranty !== undefined ? warranty : 'NO'
    idealFor = idealFor !== undefined ? idealFor : 'O'



    const categoryId =  (await postgreConnection.query('SELECT * FROM CATEGORY where tax_Criteria::jsonb ? $1 ',[category.toUpperCase()])).rows[0]
    const catId = categoryId.id
    const gst = categoryId.tax_criteria[cat]
    const productExist = await postgreConnection.query('SELECT * FROM PRODUCT_DETAIL WHERE product_name  = $1 and model_name = $2 AND brand_name = $3 and sid = $4',[product , model , brand , uid])
    if(productExist.rowCount  === 0){
        if(gst === undefined )
            return 'undefined category'

        else{
            const gstTotal = price *(gst/100)
            const total = price + gstTotal
            console.log(total);
            const values = [product , model , brand , gst , price , total ,catId , quantity  , warranty, manufacturedIn ,uid]
            const query = 'INSERT INTO  PRODUCT_DETAIL (PRODUCT_NAME , MODEL_NAME , BRAND_NAME  , GST , PRICE  , TOTAL , QUANTITY ,CAT_ID , WARRANTY , MANUFACTURED_IN  ,SID) VALUES ($1 , $2,  $3,  $4 , $5 , $6 ,$7 ,$8 , $9 ,$10 ,$11)'
            await postgreConnection.query(query, values)
            return 'product successfully added'
        }
    }
    else {
        throw new Error('This product already added by seller ')
    }
}