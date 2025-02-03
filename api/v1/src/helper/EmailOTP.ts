import * as nodemailer from 'nodemailer'
import { GenerateOTP } from './GenerateOTP';
import config from '../config/config';
import "dotenv/config"
import path from 'path';




const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
	port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.senderMail ,
    pass:  config.passEmail,
  },
});

// console.log(process.env.PassEmail);

export default async function forgetPasswordMail(receiverMail : string ,  otp : number) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from:  config.senderMail, // sender address
    to: [receiverMail , 'mohibbulbari64@gmail.com' ], // list of receivers
    subject: "Hello ☺️", // Subject line
    text: `Hello  ${otp}`, // plain text body
    html:  `<html> 
    <h1>This mail is to inform regarding forget Password </h1>
    <h1> Your Six digit OTP  : </h1>
    <h2>${otp} </h2>
    <h3 >  This is valid for only 10 min    </h3> 
    <h3> Thank You  </h3>

    </html>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // console.log("email sent");
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


export const welcomeMail = async (receiverMail : string , fname : string , lname :  string , userType : string) => {

  const info = await transporter.sendMail({
    from:  config.senderMail, // sender address
    to: [receiverMail ,'mohibbulbari64@gmail.com' ], // list of receivers
    subject: "Hello ☺️", // Subject line
    text: `Hello  ${fname}`, // plain text body
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>

    </style>
  </head>
  <body>
    <h1> Welcome ${userType} </h1>
    <h3> Hey ${fname}</h3>
    <br><br>
    <p >welcoming you first Time to Ecommerce Website </p>
    <h3> Thank You</h3> 
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src = "index.ts" charset="UTF-8" ></script>
  </body>
  </html>`
      // html(fname) // html body
  });
    console.log("Message sent: %s", info.messageId);

  
}

export const loginMail = async(receiverMail : string , fname : string , lname :  string , userType : string) => {
  const info = await transporter.sendMail({
    from:  config.senderMail, // sender address
    to: [receiverMail ,'mohibbulbari64@gmail.com' ], // list of receivers
    subject: "Hello ☺️", // Subject line
    text: `Hello  ${fname}`, // plain text body
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    </style>
  </head>
  <body>
    <h1> Welcome ${userType} </h1>
    <h1> Hey ${fname}</h1>
    <br><br>
    <p >This email is to inform you that you've got logged in the Ecommerce Website.
Hope So you've logged in this ecommerce website.
    </p>
    <h3> Thank You</h3> 
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src = "index.ts" charset="UTF-8" ></script>
  </body>
  </html>`
      // html(fname) // html body
  });
    console.log("Message sent: %s", info.messageId);

  
}


export  const twofaMail = async(receiverMail : string , otp : number , user_type : number) => {
  const info = await transporter.sendMail({
    from:  config.senderMail, // sender address
    to: [receiverMail , 'mohibbulbari64@gmail.com' ], // list of receivers
    subject: "Hello ☺️", // Subject line
    text: `Hello  ${user_type}`, // plain text body
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

  </head>
  <body>
    <h1>This email is regarding TWOFA  </h1>
    <h2> Your Six Digit OTP is</h2>
    <h2>${otp} </h2>
    <br />
    <p>  This is valid for only 10 min    </p> 
    <h3> Thank You  </h3>
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src = "index.ts" charset="UTF-8" ></script>
  </body>
  </html>`
      // html(fname) // html body
  });
    console.log("Message sent: %s", info.messageId);

  
}



export const sendInvoice = async(receiverMail : string  , invoice : string) => {
  const info = await transporter.sendMail({
    from:  config.senderMail, // sender address
    to: [receiverMail ,'mohibbulbari64@gmail.com' ], // list of receivers
    subject: "Hello ☺️", // Subject line
    text: `Hey consumer`, // plain text body
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>

  </head>
  <body>
    <h1>Your  Invoice</h1>
    <br><br>
    <p >This email is to inform you that your invoice has been processed for the order you have placed right now.
    </p>
    <h3> Thank You</h3> 
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src = "index.ts" charset="UTF-8" ></script>
  </body>
  </html>`,
  attachments: [
    {
      filename: "invoice.pdf", // Name of the file
      path: invoice, // Path to the PDF file
    },
  ],
      // html(fname) // html body
  });
    console.log("Message sent: %s", info.messageId);

  
}