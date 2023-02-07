const nodeMailer = require('nodemailer');

const sendEmail = async (Option) => {
    const transporter = nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        secure: true,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })

    const mailOption = {
        from:process.env.SMPT_MAIL,
        to:Option.email,
        subject:Option.subject,
        message:Option.message,
    }

    await transporter.sendMail(mailOption);
};


module.exports = sendEmail;