import nodemailer from "nodemailer";
import "dotenv/config";


// TODO: Add the correct nodeMailer credentials

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
    },
});

// port â€“ is the port to connect to (defaults to 587 if is secure is false or 465 if true)

export default transporter;