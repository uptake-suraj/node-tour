const nodemailer = require('nodemailer')

const sendMail = async options => {
    // 1) create transpoter
    const transpoter = nodemailer.createTransport({
        host :  process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        auth : {
            user : process.env.EMAIL_USERNAME,
            pass : process.env.EMAIL_PASSWORD
        }
        // Activate in gmail "less secure app" option
    })
    // 2) define the email options
    const mailOptions = {
        from: 'Suraj Pithva <aniketsuraj8@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message, // change 'text' to 'message'
      };
    // 3) Actually send email
  await transpoter.sendMail(mailOptions)
}
module.exports = sendMail