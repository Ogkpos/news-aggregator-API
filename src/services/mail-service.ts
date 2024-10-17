import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: process.env.EMAIL_HOST!,
  port: process.env.EMAIL_PORT!,
  secure: process.env.EMAIL_PORT! === "465",
  auth: {
    user: process.env.EMAIL_USERNAME!,
    pass: process.env.EMAIL_PASSWORD!,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `http://127.0.0.1:4000/api/users/verifyemail?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your email address",
    html: `
    <h4>Welcome to YourApp!</h4>
      <p>Please verify your email by clicking on the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `,
  };
  await transporter.sendMail(mailOptions);
};
