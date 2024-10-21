import express, { Request, Response } from "express";
import { User } from "../models/user";
import { NotFoundError } from "../errors/not-found-error";
import { Article } from "../models/article";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get(
  "/api/notifications/daily",
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id);
    if (!user || !user.notifications.dailyDigest?.enabled) {
      throw new NotFoundError();
    }

    const { categories } = user.notifications.dailyDigest;
    const [hours, minutes]: any = user.notifications?.dailyDigest?.time
      ?.toString()
      .split(":")
      .map(Number);
    const customTime = new Date();
    customTime.setHours(hours, minutes, 0, 0);

    const oneDayAgo = new Date(Date.now() - 120 * 60 * 60 * 1000);

    const dailyDigestNews = await Article.find({
      keywords: { $in: categories },
      publishedAt: { $gte: oneDayAgo, $lte: customTime },
    });
    res.send(dailyDigestNews);
  }
);

export { router as getDailyDigestRouter };
