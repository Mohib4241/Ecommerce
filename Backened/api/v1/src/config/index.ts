import "dotenv/config"



export default {
    PORT : Number(process.env.PORT)  ,
    key : process.env.key,
    Username : process.env.username,
    host : process.env.host ,
    database : process.env.database,
    password : process.env.password , 
    PortDB : Number(process.env.PortdB)  ,
    ACCOUNT_SID : process.env.ACCOUNT_SID ,
    AUTH_TOKEN : process.env.AUTH_TOKEN  ,  
    NUMBER : process.env.Number ,
    senderMail :  'mohib829942@gmail.com',
    passEmail: process.env.PassEmail || 'nizowfwgenxdnaew',
    deliveryStatus : ['PROCESSED','SHIPPED','IN TRANSIT','OUT FOR DELIVERY','DELIVERED','UNDELIVERED'],
    deliveryPartner :['Shiprocket','Ekart', 'Ecom']

}
