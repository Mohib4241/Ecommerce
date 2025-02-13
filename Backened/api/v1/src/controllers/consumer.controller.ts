import { Request ,response,Response } from "express"
import * as ConsumerAuth from '../services/consumer.services'
import * as ConsumerCart  from '../services/consumer.services' 
import Joi from "joi"
import { error } from "jquery"
import EmailOTP from "src/helper/EmailOTP"


// SignUp
export const signUp = async (req : Request , res : Response) => {

    const detail = req.body        

    try{
        const schema = Joi.object({
            fname : Joi.string().min(1).required(),
            mname : Joi.string(),
            lname : Joi.string().min(1).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            number : Joi.number().min(10).required(),
            gender : Joi.string().valid('M','F','O')
    
        })
        detail.gender = detail.gender.toUpperCase()
        const {error , value} = schema.validate(detail)
        if(error)
            throw error
        
        else{
            const response = await ConsumerAuth.SignUp(detail)
            res.status(201).send(response)
        }
    
    }
    
        catch(error){
            console.log(error.message);
            res.status(401).json("Invalid Entries")
        }
}



// Login 

interface loginDetail{
    email? : string,
    password? : string,
    number? : number
}

export const Login = async( req : Request , res : Response ) => {
    
    const detail : loginDetail = req.body
    const {email , password , number } = detail
    try{
        const emailSchema = Joi.object({
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required()

        })

        const numSchema = Joi.object({
            number : Joi.number().required()
        })

       if(email !== undefined && password !== undefined){
            const{error } = emailSchema.validate(detail)
            if(error)
                throw error

            else{
                const response = await ConsumerAuth.login(detail)
                res.status(201).send(response)
            }
            
        }

        else if(number !== undefined){
            const {error} = numSchema.validate(detail)
            if(error)
                throw error

            else{
                const response = await ConsumerAuth.login(detail) 
                res.status(201).send(response)
            }
        }
        else{
            throw "e"
        }

    
    }
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid entries")
    }

}


// Verify Twofa
export const verifyTwofa = async (req : Request , res : Response) => {
    
    try{   
        const userDetail = req.body
        const OTPschema = Joi.object({
            otp : Joi.number().required()
        })

        const {error} = OTPschema.validate(userDetail)
        if(error)
            throw error

        else{
            const response = await ConsumerAuth.verifyTwofa(userDetail)
            res.status(201).send(response)
        }

    }
    catch(error){
        res.status(401).send("Invalid OTP")
    }
}

export const verifyMobileOTP = async(req : Request , res : Response) => {
    try{
        const userOTP = req.body
        const schema = Joi.object({
            otp : Joi.number().required()
        })

        const {error} = schema.validate(userOTP)
        if(error)
            throw error

        else{
        const response  = await ConsumerAuth.verifyMobileOTP(userOTP.otp)
        res.status(201).send(response)
        }
    }
    catch(err){
        console.log(err);
        res.status(201)
    }
}

export const changePassword = async(req : Request , res : Response) => {
    
    try{
        const schema = Joi.object({
            oldPassword : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            newPassword : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            confirmPassword : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required()
        })

        const userPassDetail = req.body
        const uid = req.id
        const {error} = schema.validate(userPassDetail)
        if(error)
            throw error

        else{
            const response = await ConsumerAuth.changePassword(uid , userPassDetail)
            res.status(201).send(response)
        }

    }   
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid Request")
    }
}

export const generateForgetPasswordOTP = async ( req : Request , res  :   Response ) => {
    
    try{
        const schema = Joi.object({
            email : Joi.string().email(),
            number  : Joi.number().min(7)
        })

        const {error } = schema.validate(req.body)
        
        if(error)
            throw error

        else{
            const response = await  ConsumerAuth.generateForgetPasswordOTP(req.body)
            res.status(201).send(response)
        }   
        
    }
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid request")
    }
}

export const verifyforgetEmailOTP = async (req  : Request , res : Response) => {
    
    try{
        const schema = Joi.object({
            otp : Joi.number().required()
        })

        const{error} = schema.validate(req.body)
        if(error)
            throw error

        else{

            const response = await ConsumerAuth.verifyforgetEmailOTP(req.body)
            if(response === 'OTP doesn\'t matched')
                throw "OTP doesn\'t matched"

            res.status(201).send(response)
        }

    }
    catch(error){
        console.log(error.message);
        if(error === 'OTP doesn\'t matched')
             res.status(401).send(error)

        else
            res.status(401).send("Invalid Entries")
        }
}

export const verifyforgetMobileOTP = async (req  : Request , res : Response) => {
    
    try{
        const schema = Joi.object({
            otp : Joi.number().required()
        })

        const{error} = schema.validate(req.body)
        if(error)
            throw error

        else{
            const response = await ConsumerAuth.verifyforgetMobileOTP(req.body)
            if(response === 'OTP doesn\'t matched')
                throw "OTP doesn\'t matched"

            res.status(201).send(response)
        }

    }
    catch(error){
        console.log(error.message);
        if(error === 'OTP doesn\'t matched')
             res.status(401).send(error)

        else
            res.status(401).send("Invalid Entries")
        }
}

export const generateNewPassword = async(req : Request , res : Response) => {
    try{
        const schema = Joi.object({
            secretKey : Joi.string().required(),
            newPassword : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            confirmPassword : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required()
        })

        const {error} = schema.validate(req.body)
        if(error)
            throw error

        else{
            const resposne = await ConsumerAuth.newPassword(req.body)
            res.status(201).send(resposne)
        }
    }
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid Access Key")
    }
}

export const refresh = async(req : Request ,res : Response)=>{

    try{
        const uid = req.id
        const refershToken = req.headers.authorization
        const response = await ConsumerAuth.newToken(uid ,refershToken)
        res.status(201).send(response)
    }
    catch(error){
        res.status(401).send("Invalid Request")
    }

}

// Order and Cart 
export const inventoryDetail = async(req : Request , res : Response) => {
    
    try{

        const response = await ConsumerCart.inventory();

        res.status(201).send(response)
    }
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid Request")
    }

}   

// add
export const addToCart = async(req : Request ,res : Response) => {
    
    try{
        const uid = req.id
        const cartDetail = req.body
        const cartSchema = Joi.object({
            brand : Joi.string().min(1).required(),
            model : Joi.string().min(1).required(),
            Quantity : Joi.number().min(1)
        })      
        
        if(error)
            throw error

        else{
            const response = await ConsumerCart.addCart(uid , cartDetail)
            console.log(response);
            res.status(201).send(response)
        }

    }
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid entries")
    }

}

export const removeFromCart = async(req : Request ,res : Response) => {

    try{
        const itemDetail = req.body
        const uid = req.id

        const cartSchema = Joi.object({
            brand : Joi.string().min(1).required(),
            model : Joi.string().min(1).required(),
            Quantity : Joi.number().min(1)
        })   

        const {error} = cartSchema.validate(itemDetail)
        if(error)
            throw error

        else{
            const response = await ConsumerCart.removeCart(uid , itemDetail)


            console.log(response);
            res.status(201).send(response)
        }

    }
    catch(error){
        console.log(error.message);
        res.status(401).send(error.message)
    }

}


export const cartItem = async(req :Request , res : Response ) =>{
    
    try{
        const uid = req.id
        const response = await ConsumerCart.getCartDetail(uid)
        res.status(201).send(response)
    }
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid Request")
    }
}

// order
export const orderNow = async (req  : Request ,res  : Response) => {
    
    try{

        const schema = Joi.object({
            pincode : Joi.number().required(),
            area : Joi.string().required(),
            paymentMode : Joi.valid('UPI','COD','CARD','NET BANKING', 'EMI'  ).required()
        })
        const uid = req.id
        const usrInfo = req.body
        const {error} = schema.validate(usrInfo)
        if(error)
            throw error

        else{
            const response = await ConsumerCart.buyNow(uid , usrInfo)
        
            res.status(201).send(response)
        }
      

    }
    catch(error){
        console.log(error.message);
        res.status(401).send(error.message)
    }
}

export const OrderHistory = async(req : Request, res : Response ) => {
    
    try{
        const response = await ConsumerCart.orderHistory(req.id)
        res.status(201).send(response)
    }
    catch(error){
        res.status(401).send('Invalid request')
    }
}