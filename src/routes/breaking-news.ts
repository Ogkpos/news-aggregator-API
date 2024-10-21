import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { NotFoundError } from "../errors/not-found-error";

const router = express.Router();

router.post(
  "/api/notifications/breaking",
  requireAuth,
  [
    body("sources").optional().isArray(),
    body("categories").optional().isArray(),
    body("keywords").optional().isArray(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }
    const { sources, categories, keywords } = req.body;
    user.notifications.breakingNews = {
      enabled: true,
      sources: sources || [],
      categories: categories || [],
      keywords: keywords || [],
    };
    await user.save();
    res.send({
      message: "Breaking news preferences updated",
      data: user.notifications.breakingNews,
    });
  }
);

export { router as breakingNewsRouter };
