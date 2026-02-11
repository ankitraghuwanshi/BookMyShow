const nodemailer = require('nodemailer');
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { EMAIL, APP_PASSWORD } = process.env;

function replaceContent(content, creds) {
    let allkeysArr = Object.keys(creds);

    allkeysArr.forEach(function (key) {
        const regex = new RegExp(`#{${key}}`, 'g');
        content = content.replace(regex, creds[key]);
    });

    return content;
}

async function emailHelper(templateName, receiverEmail, creds) {
    try {

        if (!receiverEmail) {
            throw new Error('Receiver email is required');
        }

        if (!EMAIL || !APP_PASSWORD) {
            throw new Error('EMAIL or APP_PASSWORD not configured');
        }

        const templatePath = path.join(__dirname, 'templates', templateName);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        let content = await fs.promises.readFile(templatePath, "utf-8");
        const finalContent = replaceContent(content, creds);

        const emailDetails = {
            to: receiverEmail,
            from: EMAIL,
            subject: creds.subject || 'Mail from BookMyShows',
            text: creds.text || `Hi ${creds.name || 'User'}`,
            html: finalContent,
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL,
                pass: APP_PASSWORD
            }
        });

        const info = await transporter.sendMail(emailDetails);

        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (err) {
        console.error('Email sending failed:', err.message);
        throw err;
    }
}

module.exports = emailHelper;