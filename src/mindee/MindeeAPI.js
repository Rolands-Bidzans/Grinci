// Load environment variables from .env file
require('dotenv').config();
const mindee = require("mindee");

class MindeeAPI {

    getInvoiceData = async (fileName) => {

        // Init a new client
        const mindeeClient = new mindee.Client({ apiKey: process.env.MI_API_KEY });

        // Load a file from disk
        //const inputSource = await mindeeClient.docFromPath("./elektriba_10_04_2024.pdf");
        const inputSource =  mindeeClient.docFromPath(`./public/invoiceFiles/${fileName}.pdf`);
   
        // Parse the file
        const apiResponse = mindeeClient.parse(
            mindee.product.InvoiceV4,
            inputSource
        );

        let response = {};
        // Handle the response Promise
        await apiResponse.then((resp) => {

            response = resp.document

        }).catch((error) => {
            console.error("Error occurred:", error);
        });

        return response
    }
}

module.exports = new MindeeAPI();