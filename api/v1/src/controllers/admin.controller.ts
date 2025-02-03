import Joi from "joi";
import { Request , Response } from "express";
import * as adminServices from '../services//admin.services'

export const addCategory =  async(req : Request , res : Response ) => {

    try{
        const detail = req.body
        const {category} = detail
        const schema = Joi.object(
            {
                category : Joi.string().required()
            }
        );
        const{error , value} = schema.validate(detail)
        if(error)
            throw error

        else{
            const response = await adminServices.addCat(category)
            res.status(201).send(response)
        }

    }
    catch(error){
        console.log(error.message);
        res.status(404).send("Invalid Category")
    }
}
 