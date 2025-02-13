// import { string } from "joi";
import { postgreConnection } from "../utility/postgreConnection";

// ADDING CATEGORY 
export const addCat = async(category : string) =>{

    try{
        await postgreConnection.query('BEGIN')
        const catExist = await postgreConnection.query('SELECT * from CATEGORY WHERE CATEGORY_NAME = $1 ', [category])
        if(catExist.rowCount === 0 ){
            console.log(category);
            await postgreConnection.query('INSERT INTO CATEGORY (CATEGORY_NAME) VALUES ($1)',[category.toUpperCase()])
            await postgreConnection.query('COMMIT')
            return 'Successfully added'
        }
        else{
            await postgreConnection.query('ROLLBACK')
            return 'category already exist'
        }

    }
    catch(error){
        await postgreConnection.query('ROLLBACK')
        return 'error'

    }     
}