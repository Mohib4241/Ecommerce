import { Request ,Response } from "express"
import * as sellerServices from '../services/seller.services' 
import Joi from "joi"

// Sign Up User
export const signUpSeller = async (req : Request , res : Response ) =>{
    try{
        const sellerSignUpDetail = req.body
        const sellerSchema = Joi.object({
            fname : Joi.string(),
            mname  : Joi.string(),
            lname  : Joi.string(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-z0-9!%_`~@#$%]{8,30}$')).required(),
            number : Joi.number().min(10).required(),
            gender : Joi.string().valid('M','F','O', 'm','f','o'),
            companyName : Joi.string().min(3).required(),
            companyAdd : Joi.string().min(4).required(),
            gstNo : Joi.string().required()
     
        })

        const {error} = sellerSchema.validate(sellerSignUpDetail)
        if(error) 
            throw error

        else{
            const response = await sellerServices.SignUp(sellerSignUpDetail)
            res.status(201).send(response)
        }

    }
    catch(error){
        console.log(error.message);
        res.status(401).send("Invalid Entries")
    }

}

// Login Seller


export const loginSeller = async (req : Request , res  : Response ) => {

  const detail  = req.body
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
                const response = await sellerServices.loginSeller(detail)
                res.status(201).send(response)
            }
            
        }

        else if(number !== undefined){
            const {error} = numSchema.validate(detail)
            if(error)
                throw error

            else{
                const response = await sellerServices.loginSeller(detail) 
                if(response === error)
                    throw error
            
                
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


export const twoFa = async(req  : Request , res : Response ) => { 

    try{   
        const userDetail = req.body

        const OTPschema = Joi.object({
            otp : Joi.number().min(6).required()
        })

        const {error} = OTPschema.validate(userDetail)
        if(error)
            throw error

        else{
            const response = await sellerServices.verifyTwofa(userDetail)
            res.status(201).send(response)
        }

    }
        catch(error){
            res.status(401).send("Invalid OTP")
        }

}


export const verifyMobileOTP = async(req : Request , res : Response) => {
    try{
        const sellerOTP = req.body

        const schema = Joi.object({
            otp : Joi.number().min(6).required()
        })

        const {error} = schema.validate(sellerOTP)
        if(error)
            throw error

        else{
        console.log(sellerOTP);
        const response  = await sellerServices.verifyMobileOTP(sellerOTP.otp)
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
            const response = await  sellerServices.changePassword(uid , userPassDetail)
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
            const response = await sellerServices.generateForgetPasswordOTP(req.body)
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
            otp : Joi.number().min(6).max(6).required()
        })

        const{error} = schema.validate(req.body)
        if(error)
            throw error

        else{
            const response = await sellerServices.verifyforgetEmailOTP(req.body)
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
            otp : Joi.number().min(6).max(6).required()
        })

        const{error} = schema.validate(req.body)
        if(error)
            throw error

        else{
            const response = await sellerServices.verifyforgetMobileOTP(req.body)
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
            const resposne = await sellerServices.newPassword(req.body)
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
        const response = await sellerServices.newToken(uid)
        res.status(201).send(response)
    }
    catch(error){
        res.status(401).send("Invalid Request")
    }

}


export const addInventory  = async(req : Request , res : Response) => {
    
    try {
        const schema = Joi.object({
            product : Joi.string().required(),
            brand : Joi.string().required(),
            quantity : Joi.number().required(),
            model : Joi.string().required(),
            price : Joi.number().required(),
            category: Joi.string().required(),
            manufacturedIn  : Joi.string(),
            warranty : Joi.string(),
            idealFor : Joi.string()
        })
        const {error}  = schema.validate(req.body)
        if(error) throw new Error('Please filled require details correctly')

        else{
            const response = await sellerServices.addInventory(req.id , req.body)
            res.status(201).send(response)
        }


    } catch (error) {
        console.log(error.message);
        res.status(201).send(error.message)
        
    }
} 