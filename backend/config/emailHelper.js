const nodemailer = require('nodemailer');
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { SENDGRID_API_KEY } = process.env;

function replaceContent(content, creds) {
    let allkeysArr = Object.keys(creds);

    allkeysArr.forEach(function (key) {
        // Use global regex to replace all occurrences
        const regex = new RegExp(`#{${key}}`, 'g');
        content = content.replace(regex, creds[key]);
    });

    return content;
}

// template can be otp.html or ticket.html
async function emailHelper(templateName, receiverEmail, creds) { 
    try {
        // Validate inputs
        if (!receiverEmail) {
            throw new Error('Receiver email is required');
        }

        if (!SENDGRID_API_KEY) {
            throw new Error('SENDGRID_API_KEY is not configured in environment variables');
        }

        // Build template path - assumes templates are in a 'templates' folder
        const templatePath = path.join(__dirname, 'templates', templateName);
        
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        let content = await fs.promises.readFile(templatePath, "utf-8");
        
        // Replace placeholders with actual values
        const finalContent = replaceContent(content, creds);

        const emailDetails = {
            to: receiverEmail, // Fixed typo: reciverEmail -> receiverEmail
            from: 'ankit123developer321@gmail.com',
            subject: creds.subject || 'Mail from BookMyShows', // Make subject dynamic
            text: creds.text || `Hi ${creds.name || 'User'}`,
            html: finalContent,
        };

        // Configuration for sendgrid
        const transportDetails = {
            host: 'smtp.sendgrid.net',
            port: 465,
            secure: true, // Added secure flag for port 465
            auth: {
                user: "apikey",
                pass: SENDGRID_API_KEY
            }
        };

        const transporter = nodemailer.createTransport(transportDetails);
        
        // Removed extra parentheses around emailDetails
        const info = await transporter.sendMail(emailDetails);
        
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (err) {
        console.error('Email sending failed:', err.message);
        throw err; // Re-throw error so calling function can handle it
    }
}

module.exports = emailHelper;