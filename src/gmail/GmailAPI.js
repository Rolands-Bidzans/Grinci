// Load environment variables from .env file
require('dotenv').config();
//Dependancies need to install
const axios = require('axios');
const qs = require('qs');

class GmailAPI {

    getAccessToken = async () => {
        let data = qs.stringify({
            'client_id': process.env.GM_CLIENT_ID,
            'client_secret': process.env.GM_CLIENT_SECRET,
            'refresh_token': process.env.GM_REFRESH_TOKEN,
            'grant_type': 'refresh_token'
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://accounts.google.com/o/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        let accessToken = "";

        await axios.request(config)
            .then(async (response) => {
                accessToken = await response.data.access_token;
            })
            .catch((error) => {
                console.log(error);
            });

        return accessToken;
    }

    searchGmail = async (dateTime) => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`
            },
            params: {
                q: `has:attachment filename:pdf after:${dateTime}`
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
                            attachmentID: ''
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });

        return messagesData;
    }

    getAttachmentsForMessages = async (messages) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: '',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`
            }
        };

        for (let i = 0; i < messages.length; i++) {

            config.url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messages[i].messageId}`;
            await axios.request(config)
                .then(async (response) => {
                    for (const part of await response.data.payload.parts) {
                        // Check if the part is a PDF attachment
                        if (part.mimeType === 'application/pdf') {
                            messages[i].attachmentID = await part.body.attachmentId
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        
        return messages;
    }

    downloadFilePDF = async (messages) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: '',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`
            }
        };

        let pdfData = [];

        for (let i = 0; i < messages.length; i++) {
            config.url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messages[i].messageId}/attachments/${messages[i].attachmentID}`

            await axios.request(config)
                .then(async (response) => {
                    //console.log(response.data)
                    pdfData.push({
                        messageId: messages[i].messageId,
                        data: await response.data["data"]
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        return pdfData;
    }
}

module.exports = new GmailAPI();