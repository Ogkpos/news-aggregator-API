import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";

import { body } from "express-validator";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/verifyotp",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("otp").isNumeric().withMessage("OTP must be numeric"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid email");
    }

    if (existingUser.otp !== otp || Date.now() > existingUser.otpExpiresAt) {
      throw new BadRequestError("Invalid email or expired/invalid OTP code");
    }

    existingUser.set({ verified: true });
    await existingUser.save();

    //Generate Token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      process.env.JWT_SECRET!
    );

    // existingUser.otp = undefined;
    req.session = {
      jwt: token,
    };

    res.status(200).send({ message: "Login successful", user: existingUser });
  }
);

export { router as verifyOTPRouter };
