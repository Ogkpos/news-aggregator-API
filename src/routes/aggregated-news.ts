import express, { Request, Response, NextFunction } from "express";
import { getNewsFromSources } from "../services/rss-parser";
import { requireAuth } from "../middlewares/require-auth";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();

router.get("/api/news", requireAuth, async (req: Request, res: Response) => {
  const user = await User.findById(req.currentUser!.id);
  if (!user) {
    throw new BadRequestError("User not found");
  }
  const { preferences } = user;

  if (!preferences?.sources || !preferences.keywords?.include) {
    throw new BadRequestError("User preferences are missing");
  }
  const aggregatedNews = await getNewsFromSources(
    preferences.sources,
    preferences.keywords.include
  );
  res.send(aggregatedNews);
});
export { router as aggregatedNewsRouter };
