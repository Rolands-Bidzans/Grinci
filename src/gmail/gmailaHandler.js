const fs = require('fs');
const axios = require('axios');
const { Buffer } = require('buffer');
const moment = require('moment-timezone');
const path = require('path');
const database = require(path.join(__dirname, '..', '..', 'db', 'Database'));

async function saveBase64AsPDF(base64Data, outputFilename) {
    // Decode base64 encoded string into binary data
    const binaryData = await Buffer.from(base64Data, 'base64');

    // Write binary data to a buffer
    const pdfBuffer = await Buffer.from(binaryData, 'binary');

    // Save buffer to a PDF file
    fs.writeFileSync(outputFilename, pdfBuffer);
}

function convertUnixTimestampToPostgresTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function getTimestampLatvia() {

    const currentTimestampUTC = Math.floor(Date.now() / 1000);

    return currentTimestampUTC;
}

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
    let invoiceData = document.inference.prediction;
    const invoiceItems = [];
    for (const item of invoiceData.lineItems) {
        invoiceItems.push({
            description: item.description,
            quantity: item.quantity,
            totalAmount: item.totalAmount,
            unitPrice: item.unitPrice,
            amount: item.totalAmount
          });
    }
    

    for (const key in invoiceData) {
        for (const item in data) {
            if (item == key) {
                data[item] = invoiceData[key].value
            }
        }

    }

    return  { data, invoiceItems }
}

async function emailProcess() {
    const gmailAPI = require("./GmailAPI");
    const mindeeAPI = require("../mindee/MindeeAPI");
  
    try {
        await database.open();

        const query = `SELECT *
                       FROM "MonitoringEmails"
                       WHERE is_enabled = true`
        const MonitorEmails = await database.customQuery(query);
       
        //Loop all messages
        for (let email of MonitorEmails){

            // Currrent time in Latvia
            let currentLatvianTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Riga' });
            currentLatvianTime = new Date(currentLatvianTime);

            // Defined time in DB
            const monitorStartDate = new Date(email.next_checking_date);

            // Skip if it is not time to staart monitoring email
            if(currentLatvianTime < monitorStartDate) continue;
    
            //ISO 8601 formatted timestamp "2024-05-26T05:49:55.000Z" to a Unix timestamp
            const unixTimestamp = Date.parse(monitorStartDate);
            //Unix timestamp in milliseconds
            const unixTimestampInSeconds = unixTimestamp / 1000;
            email.next_checking_date = unixTimestampInSeconds;

            //Get messages from Gmail
            let messages = await gmailAPI.searchGmail(email);

            //GET CURRENT TIME FOR DB
            let postgresTimestamp = new Date().toLocaleString('en-US', { timeZone: 'Europe/Riga' });
            postgresTimestamp = new Date(postgresTimestamp);//Convert latvian time to UTC
            postgresTimestamp = postgresTimestamp.toISOString().slice(0, 19).replace("T", " ") + ".485+00";

            //DB QUERY
            const query = `UPDATE "MonitoringEmails"
            SET next_checking_date = '${postgresTimestamp}'
            WHERE id = ${email.id};`

            //save time to DB
            await database.customQuery(query);

            //If no messages or error occured durig connection to Gmail
            console.log('Messages:')
            console.log(messages);
            if(!messages || !messages.length) continue;
            
            messages = await gmailAPI.getAttachmentsForMessages(messages, email)

            if(!messages.length) continue;

            let pdfFiles = await gmailAPI.downloadFilePDF(messages, email);
            if(!pdfFiles.length) continue;

            for (const file of pdfFiles) {
                await saveBase64AsPDF(file.data, `./public/invoiceFiles/${file.messageId}.pdf`);

                const invoiceDocument = await mindeeAPI.getInvoiceData(file.messageId)

                //Error or no data
                if(!invoiceDocument) continue;
                const usefullData = await retrieveUsefulData(invoiceDocument);

                const generalData = usefullData.data;
                const items = usefullData.invoiceItems;

                //Send to DB
                let invoiceID = [];
                console.log('beigas')
                                            console.log(messages)                                                        
                invoiceID = await database.insertInvoice(generalData.totalAmount, false, email.group_id, email.id, messages[0].sender_text, messages[0].sender_subject, messages[0].filename, 1, generalData.customerName, generalData.customerAddress, generalData.date, generalData.dueDate, generalData.invoiceNumber, generalData.supplierName, generalData.supplierAddress, generalData.supplierPhoneNumber, generalData.supplierWebsite);

                for (const item of items  ) {
                    await database.insertItems(item.description, invoiceID[0].id, item.quantity, item.totalAmount, item.unitPrice) 
                }
            }

        };
    } catch (error) {
        console.error('Error during database operations', error);
    } finally {
        // Close the database connection
        await database.close();
    }

    //Wait till nex iteration
    setTimeout(async () => {
        emailProcess()
    }, 1 * 10 * 1000)
}

emailProcess()