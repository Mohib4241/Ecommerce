import pkg from 'pg'
import config from '../config'
const  {Pool} = pkg




export const postgreConnection = new Pool ({
    user: config.Username,        // Your PostgreSQL username
    host: config.host,        // Hostname (localhost or server IP)
    database: config.database,// Database name
    password: config.password,// Your PostgreSQL password
    port  :   config.PortDB , 
})


export  async function fetch() {
    const todo_data = (await postgreConnection.query('select * from user_info'));
    // console.log(await postgreConnection.query('select * from cart_detail'))
    // console.log(await postgreConnection.query('select * from transaction_info'));
    // console.log(await postgreConnection.query('select * from order_history'));
    console.log(await postgreConnection.query('select * from product_detail'));




// const user_detail =  await postgreConnection.query('select * from cart_detail')
// console.log( todo_data);
// console.log(user_detail);
    
}


