import express, { Request, Response, NextFunction } from "express";
import { Article } from "../models/article";
import { NotFoundError } from "../errors/not-found-error";

const router = express.Router();

router.get(
  "/api/articles/:articleId/comments",
  async (req: Request, res: Response) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username",
      },
    });

    if (!article) {
      throw new NotFoundError();
    }

    res.status(201).send(article);
  }
);

export { router as getCommentRouter };
