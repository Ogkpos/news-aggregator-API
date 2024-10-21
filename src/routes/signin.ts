import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { Password } from "../services/password";
import { authenticator } from "otplib";

const router = express.Router();

const otpfunc = () => {
  try {
    const secret: string = process.env.OTP_SECRET!;
    const token: any = authenticator.generate(secret);
    authenticator.check(token, secret) as any;
    return +token;
  } catch (error) {
    // console.log(error);
  }
};
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Please provide a Password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    //otp
    const otp = otpfunc();
    //console.log(otp);
    //
    const otpExpiration = Date.now() + 1 * 60 * 1000;
    //
    existingUser.otp = otp;
    existingUser.otpExpiresAt = otpExpiration;

    //send to mail

    await existingUser.save();
    res.send({
      message: "OTP sent successfully, expires in a minute",
      OTP: otp,
      data: {
        existingUser,
      },
    });
  }
);
export { router as signinRouter };
