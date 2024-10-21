import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { sendVerificationEmail } from "../services/mail-service";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("interests")
      .optional()
      .isArray({ min: 0 })
      .withMessage("Interests must be an array of strings"),
    body("categories")
      .optional()
      .isArray({ min: 0 })
      .withMessage("categories must be an array of strings"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, email, password, interests } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email belongs to another user");
    }
    const user = User.build({
      username,
      email,
      password,
      preferences: { interests: interests || [] },
    });
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // res.set("Authorization", `Bearer ${token}`);
    req.session = {
      jwt: token,
    };

    //send mail
    // await sendVerificationEmail(email, token);

    res.status(201).send({ user });
  }
);
export { router as signupRouter };
