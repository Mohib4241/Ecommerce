"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoice = createInvoice;
const easyinvoice_1 = __importDefault(require("easyinvoice"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function createInvoice(orderId, deliveryInfo, userDetail, product, consumerName, sellerj, paymentMethod) {
    const data = {
        apiKey: "jeGvn99qOc4kYZMtOYMkn5fDQLTW8ZNNS9iTF1EkAyj9xx9AImMmG4wk2KhIp1Ix",
        images: {
            // logo: "/Users/mohibbulbari/Documents/Typescript/ECOMMERCE/api/v1/src/helper/logo.jpg",
            background: "https://public.budgetinvoice.com/img/watermark-draft.jpg",
        },
        sender: sellerj,
        client: userDetail,
        information: deliveryInfo,
        products: product,
        bottomNotice: paymentMethod,
        settings: {
            currency: "INR",
            marginTop: 25,
            marginRight: 25,
            marginLeft: 25,
            marginBottom: 25,
            // format: 'A5',  // Must be one of: "A4", "A3", "A5", "Legal", "Letter", "Tabloid"
            // orientation: "landscape",
        },
    };
    try {
        const invoiceDir = path_1.default.join(`/Users/mohibbulbari/Documents/Typescript/ECOMMERCE/api/v1/src/helper/invoice/${consumerName}/`);
        // Ensure the directory exists
        if (!fs_1.default.existsSync(invoiceDir)) {
            fs_1.default.mkdirSync(invoiceDir, { recursive: true });
        }
        const result = await easyinvoice_1.default.createInvoice(data);
        // console.log("Invoice generated:", result.pdf ? "Success" : "Failed");
        const filePath = path_1.default.join(invoiceDir, `./invoice${orderId}.pdf`);
        // Save the PDF file
        fs_1.default.writeFileSync(filePath, result.pdf, "base64");
        console.log(`Invoice created successfully! File saved at: ${filePath}`);
        return (invoiceDir + `invoice.pdf`);
    }
    catch (error) {
        console.error("Failed to create invoice:", error.message);
    }
}
// createInvoice();
//# sourceMappingURL=invoice.js.map