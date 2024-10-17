import express, { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = express.Router();

router.get("/api/users/verifyemail", async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token) {
    throw new BadRequestError("Token is missing");
  }

  try {
    const payload = jwt.verify(token as string, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    user.set({ verified: true });
    await user.save();
  } catch (error) {}
});

export { router as emailVerificationRouter };
