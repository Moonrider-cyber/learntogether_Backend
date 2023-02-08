const nodeMailer = require('nodemailer');

const sendEmail = async (Option) => {
    const transporter = nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })

    const mailOption = {
        from:"busilearn@gmail.com",
        to:Option.email,
        subject:Option.subject,
        text:Option.message,
    }
    await transporter.sendMail(mailOption);
};


module.exports = sendEmail;