"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvoice = exports.twofaMail = exports.loginMail = exports.welcomeMail = void 0;
exports.default = forgetPasswordMail;
const nodemailer = __importStar(require("nodemailer"));
const index_1 = __importDefault(require("../config/index"));
require("dotenv/config");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: index_1.default.senderMail,
        pass: index_1.default.passEmail,
    },
});
// console.log(process.env.PassEmail);
async function forgetPasswordMail(receiverMail, otp) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: index_1.default.senderMail, // sender address
        to: [receiverMail, 'mohibbulbari64@gmail.com'], // list of receivers
        subject: "Hello ☺️", // Subject line
        text: `Hello  ${otp}`, // plain text body
        html: `<html> 
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
const welcomeMail = async (receiverMail, fname, lname, userType) => {
    const info = await transporter.sendMail({
        from: index_1.default.senderMail, // sender address
        to: [receiverMail, 'mohibbulbari64@gmail.com'], // list of receivers
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
};
exports.welcomeMail = welcomeMail;
const loginMail = async (receiverMail, fname, lname, userType) => {
    const info = await transporter.sendMail({
        from: index_1.default.senderMail, // sender address
        to: [receiverMail, 'mohibbulbari64@gmail.com'], // list of receivers
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
};
exports.loginMail = loginMail;
const twofaMail = async (receiverMail, otp, user_type) => {
    const info = await transporter.sendMail({
        from: index_1.default.senderMail, // sender address
        to: [receiverMail, 'mohibbulbari64@gmail.com'], // list of receivers
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
};
exports.twofaMail = twofaMail;
const sendInvoice = async (receiverMail, invoice) => {
    const info = await transporter.sendMail({
        from: index_1.default.senderMail, // sender address
        to: [receiverMail, 'mohibbulbari64@gmail.com'], // list of receivers
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
};
exports.sendInvoice = sendInvoice;
//# sourceMappingURL=EmailOTP.js.map