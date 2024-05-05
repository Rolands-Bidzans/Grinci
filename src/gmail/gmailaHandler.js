const fs = require('fs');
const axios = require('axios');
const { Buffer } = require('buffer');
const moment = require('moment-timezone');

async function saveBase64AsPDF(base64Data, outputFilename) {
    // Decode base64 encoded string into binary data
    const binaryData = await Buffer.from(base64Data, 'base64');

    // Write binary data to a buffer
    const pdfBuffer = await Buffer.from(binaryData, 'binary');

    // Save buffer to a PDF file
    fs.writeFileSync(outputFilename, pdfBuffer);
}

async function getTimestampLatvia() {

    const currentTimestampUTC = Math.floor(Date.now() / 1000);

    return currentTimestampUTC;
}

let currentTimestampLatvia = 0;

async function retrieveUsefulData(document) {
    let data = {
        customerName: '',
        customerAddress: '',
        date: '',
        dueDate: '',
        invoiceNumber: '',
        supplierName: '',
        supplierAddress: '',
        supplierPhoneNumber: '',
        supplierWebsite: '',
        totalAmount: ''
    }
    let invoiceData = document.inference.prediction


    for (const key in invoiceData) {
        for (const item in data) {
            if (item == key) {
                data[item] = invoiceData[key].value
            }
        }

    }

    return data
}
async function emailProcess() {
    const gmailAPI = require("./GmailAPI");
    const mindeeAPI = require("../mindee/MindeeAPI");

    //First time will get timestamp, then will be ignored
    if (!currentTimestampLatvia) {
        currentTimestampLatvia = await getTimestampLatvia();
    }

    console.log("TimeStamp: " + currentTimestampLatvia);

    let messages = await gmailAPI.searchGmail(currentTimestampLatvia);
    if (messages.length) {

        messages = await gmailAPI.getAttachmentsForMessages(messages)
        let pdfFiles = await gmailAPI.downloadFilePDF(messages);

        for (const file of pdfFiles) {
            await saveBase64AsPDF(file.data, `./public/invoiceFiles/${file.messageId}.pdf`);

            const invoiceDocument = await mindeeAPI.getInvoiceData(file.messageId)
            const data = await retrieveUsefulData(invoiceDocument);

            console.log(data)
            //Send to DB
        }
    }

    currentTimestampLatvia = await getTimestampLatvia();
    //Wait till nex iteration
    setTimeout(async () => {
        emailProcess()
    }, 1 * 10 * 1000)
}

emailProcess()