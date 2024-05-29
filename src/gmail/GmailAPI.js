// Load environment variables from .env file
require('dotenv').config();
//Dependancies need to install
const axios = require('axios');
const qs = require('qs');

class GmailAPI {

    getAccessToken = async (credentials) => {

        let accessToken = "";

        const data = qs.stringify({
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'refresh_token': credentials.refresh_token,
            'grant_type': 'refresh_token'
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://accounts.google.com/o/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        await axios.request(config)
        .then(async (response) => {
            accessToken = await response.data.access_token;
        })
        .catch((error) => {
            return false;
        });


        return accessToken;
    }

    searchGmail = async (credentials) => {

        const accessToken = await this.getAccessToken(credentials);

        // Error during getting credentials
        if(!accessToken) return false;

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                q: `has:attachment filename:pdf after:${credentials.next_checking_date}`
            }
        };

        let messagesData = "";

        await axios.request(config)
        .then(async (response) => {
            messagesData = [];
      
            if (response.data['resultSizeEstimate']) {
                for (const message of await response.data['messages']) {
                    messagesData.push({
                        messageId: message.id,
                        sender_subject: '',
                        sender_text: '',
                        attachmentID: ''
                    });
                }
            }
        })
        .catch((error) => {
            return false;
        });


        return messagesData;
    }

    getAttachmentsForMessages = async (messages, credentials) => {

        const accessToken = await this.getAccessToken(credentials);
        // Error during getting credentials
        if(!accessToken) return false;

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: '',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        for (let i = 0; i < messages.length; i++) {
  
            config.url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messages[i].messageId}`;
            await axios.request(config)
            .then(async (response) => {

                for (const header of await response.data.payload.headers) {
                    if(header.name === 'Subject') messages[i].sender_subject = header.value;
                    if(header.name === 'Date') messages[i].received_date = header.value;
                }

                // Extract the subject if found
                for (const part of await response.data.payload.parts) {
                    // Save sender text
                    
                    if (part.mimeType === 'multipart/alternative') {
                        const base64String = part.parts[0].body.data;
                        const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
                        messages[i].sender_text = decodedString;
                    }

                    // Check if the part is a PDF attachment
                    if (part.mimeType === 'application/pdf') {
                        messages[i].attachmentID = part.body.attachmentId;
                        messages[i].filename = part.filename;
                    }
                }
            })
            .catch((error) => {
                return false;
            });
        }

        return messages;
    }

    downloadFilePDF = async (messages, credentials) => {
        const accessToken = await this.getAccessToken(credentials);
        // Error during getting credentials
        if(!accessToken) return false;

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: '',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        let pdfData = [];

        for (let i = 0; i < messages.length; i++) {
            config.url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messages[i].messageId}/attachments/${messages[i].attachmentID}`

            await axios.request(config)
                .then(async (response) => {
                    // console.log(response.data)
                    pdfData.push({
                        messageId: messages[i].messageId,
                        sender_subject: messages[i].sender_subject,
                        sender_text: messages[i].sender_text,
                        received_date: messages[i].received_date,
                        filename: messages[i].filename,
                        data: await response.data["data"]
                    })
                })
                .catch((error) => {
                    return false;
                });
        }

        return pdfData;
    }
}

module.exports = new GmailAPI();