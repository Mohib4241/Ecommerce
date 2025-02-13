"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCat = void 0;
// import { string } from "joi";
const postgreConnection_1 = require("../utility/postgreConnection");
// ADDING CATEGORY 
const addCat = async (category) => {
    try {
        await postgreConnection_1.postgreConnection.query('BEGIN');
        const catExist = await postgreConnection_1.postgreConnection.query('SELECT * from CATEGORY WHERE CATEGORY_NAME = $1 ', [category]);
        if (catExist.rowCount === 0) {
            console.log(category);
            await postgreConnection_1.postgreConnection.query('INSERT INTO CATEGORY (CATEGORY_NAME) VALUES ($1)', [category.toUpperCase()]);
            await postgreConnection_1.postgreConnection.query('COMMIT');
            return 'Successfully added';
        }
        else {
            await postgreConnection_1.postgreConnection.query('ROLLBACK');
            return 'category already exist';
        }
    }
    catch (error) {
        await postgreConnection_1.postgreConnection.query('ROLLBACK');
        return 'error';
    }
};
exports.addCat = addCat;
//# sourceMappingURL=admin.services.js.map