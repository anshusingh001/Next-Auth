import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'

export const sendMail = async ({ email, emailType, userId }: any) => {

  try {

    //configure mail for usage
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId,
        {
          $set: {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000  //expiry 1h from now
          }
        })
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId,
        {
          $set: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000
          }
        })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'codehelp',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your password" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`, // html body
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse


  } catch (error: any) {
    throw new Error(error.message)
  }
}

