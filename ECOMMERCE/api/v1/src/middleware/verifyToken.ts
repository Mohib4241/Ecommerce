import { postgreConnection } from "../utility/postgreConnection";
import { NextFunction, Request , Response } from "express";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { expression } from "joi";
import { redis } from "src/utility/Redis";

declare global {
    namespace Express{
        interface Request{
            id? : number
        }
    }
}

interface decodeAccess {
    id : number,
    iat : number ,
    exp : number 
}



export const verifyToken = async (req :  Request , res : Response , next : NextFunction)  => {
    
    try{
        const token = req.headers.authorization
        const redisToken = await redis.get("Token : access")
        console.log("re" , redisToken);
        if(redisToken === token){
            const secretKey = config.key
            const decode = jwt.verify(token ,secretKey )  as decodeAccess
            req.id = decode.id
            const id = req.id
            next()
             
        }
        else{
            res.status(401).send('wrong token')
        }
    }
    catch(error){

        res.status(401).send("Token Expired")
    }

}