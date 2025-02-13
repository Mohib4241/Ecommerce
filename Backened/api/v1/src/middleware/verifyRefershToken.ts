import { postgreConnection } from "../utility/postgreConnection"
import config from '../config'
import jwt from 'jsonwebtoken'
import { Request , Response , NextFunction  } from "express"
// import from "express";


interface token{
    id? : number,
    iat? : number,
    exp? : number
}



export  const  verifyRefresh = async (req : Request , res : Response , next : NextFunction) => {

    try{
        const refreshToken = req.headers.authorization 
        const TokenExist = (await postgreConnection.query('select * from session where refresh  = $1',[refreshToken]))  
        if(TokenExist.rowCount > 0){ 
            const token = jwt.verify(refreshToken , config.key) as token
            if ( token ) {
                req.id  = token.id
            }
            next()
        }
        else{
            res.status(401).send('your session logged out')
        }
    }
    catch(error){
        res.status(401).send('Refresh Token Expired')
    }
}