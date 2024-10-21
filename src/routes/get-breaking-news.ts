import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { User } from "../models/user";
import { NotFoundError } from "../errors/not-found-error";
import { Article } from "../models/article";

const router = express.Router();

router.get(
  "/api/notifications/breaking",
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);
    if (!user || !user.notifications.breakingNews?.enabled) {
      throw new NotFoundError();
    }

    const { sources, categories, keywords } = user.notifications.breakingNews;

    const breakingNews = await Article.find({
      $or: [
        {
          source: { $in: sources },
        },
        {
          keywords: { $in: keywords },
        },
        {
          category: { $in: categories },
        },
      ],
      publishedAt: {
        $gt: new Date(Date.now() - 144 * 60 * 60 * 1000),
      },
    });
    res.send(breakingNews);
  }
);

export { router as getBreakingNewsRouter };
