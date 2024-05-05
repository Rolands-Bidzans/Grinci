const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "d6d5751966d808e4c56c8f8469c3d105" });

// Load a file from disk
const fileName = '18f43d0a64ba6fe8'
const inputSource = mindeeClient.docFromPath(`./public/invoiceFiles/${fileName}.pdf`);

// Parse the file
const apiResponse = mindeeClient.parse(
    mindee.product.InvoiceV4,
    inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
    console.log("Supplier Name:");
    console.log(resp.document);

}).catch((error) => {
    console.error("Error occurred:", error);
});