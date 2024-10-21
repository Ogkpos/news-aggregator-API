import express, { Request, Response } from "express";
import { Article } from "../models/article";
import { requireAuth } from "../middlewares/require-auth";
import { NotFoundError } from "../errors/not-found-error";

const router = express.Router();

router.get(
  "/api/news/:articleId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) {
      throw new NotFoundError();
    }
    res.send(article);
  }
);

export { router as getSpecificNewsRouter };
