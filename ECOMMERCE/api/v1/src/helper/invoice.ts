

// import easyinvoice from "easyinvoice";
const easyinvoice = require('easyinvoice')
import fs from "fs";
import path from "path";


export async function createInvoice(orderId ,deliveryInfo ,userDetail ,product ,consumerName ,sellerj , paymentMethod)  {

    const data = {
        apiKey: "ozOYCcTaAnOsvDoGu8JUEYzpvyOznqyzEq3eJbBBsWqNO25P18qyTReVtQ96G3xx",
        mode : "Production",
        images: {
            logo: "",
            background: "https://public.budgetinvoice.com/img/watermark-draft.jpg",
        },
        sender: sellerj,
        client: userDetail ,

        information: deliveryInfo,
        products: product,

        bottomNotice: paymentMethod,
        settings: {
            currency: "INR",
            marginTop: 25,
            marginRight: 25,
            marginLeft: 25,
            marginBottom: 25,
            format: 'A4',  // Must be one of: "A4", "A3", "A5", "Legal", "Letter", "Tabloid"
            orientation: "landscape",
        },
    };

    try {

        const invoiceDir = path.join(   
            `/Users/mohibbulbari/Documents/Typescript/ECOMMERCE/api/v1/src/helper/invoice/${consumerName}/`
        );

        // Ensure the directory exists
        if (!fs.existsSync(invoiceDir)) {
            fs.mkdirSync(invoiceDir, { recursive: true });
        }

        const result = await easyinvoice.createInvoice(data);

        // console.log("Invoice generated:", result.pdf ? "Success" : "Failed");
        const filePath = path.join(invoiceDir, `./invoice${orderId}.pdf`);

        // Save the PDF file
        fs.writeFileSync(filePath, result.pdf, "base64");

        console.log(`Invoice created successfully! File saved at: ${filePath}`);
        return (invoiceDir +  `invoice.pdf`);

    } catch (error) {
        console.error("Failed to create invoice:", error.message);
    }
}

// createInvoice();