// import jwt, { SignOptions } from 'jsonwebtoken'
// import config  from '../config/index'
// import { postgre_connection } from '../utility/postgre_connection'

// import express, { Request, Response } from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       id?: number; // Optional or required, based on your needs
//     }
//   }
// }

// interface config {
//     key : number
// }

// interface option {
//   algorithm : string,
//   expiresIn  : string
// }

// export async function generateNewToken(req : Request , res : Response ){
//     const id = req.id 
//     console.log(id);
//     const options : SignOptions ={
//         algorithm : 'HS512' ,
//         expiresIn : '15min'
//     }


//     const payload = {
//         "id" : id ,
//     }


//     const accessToken = jwt.sign(payload , config.key , options) 
//     const refreshToken = jwt.sign(payload , config.key , {expiresIn : '30d'})

//     if((await postgre_connection.query('select * from session where id = $1' , [id])).rowCount === 0){

//     postgre_connection.query('DELETE FROM SESSION WHERE UID = $1', [id])
//     postgre_connection.query('INSERT INTO SESSION (ACCESS , REFRESH , UID ) VALUES  ( $1 ,  $2 , $3 ) on conflict do nothing' ,
//          [accessToken , refreshToken , id])
//     }
//     else{
//     postgre_connection.query('update session set access = $1 , refresh = $2 where uid = $3' ,
//          [accessToken, refreshToken ,id])
//     }

//     // console.log(access_token);
//     // co
//     // ole.log(refreshToken)
//     res.status(201).send( {accessToken ,  refreshToken } )
// }



// // export default GenerateNewToken
