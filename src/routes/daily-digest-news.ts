import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { requireAuth } from "../middlewares/require-auth";
import { NotFoundError } from "../errors/not-found-error";

const router = express.Router();

router.post(
  "/api/notifications/daily",
  requireAuth,
  [
    body("time")
      .optional()
      .isString()
      .withMessage("Time must be in valid format"),
    body("categories").optional().isArray(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new NotFoundError();
    }

    const { time, categories } = req.body;

    user.notifications.dailyDigest = {
      enabled: true,
      time: time || "08:00",
      categories: categories || [],
    };

    await user.save();

    res.send({
      message: "Daily digest preferences updated",
      data: user.notifications.dailyDigest,
    });
  }
);

export { router as dailyDigestRouer };
