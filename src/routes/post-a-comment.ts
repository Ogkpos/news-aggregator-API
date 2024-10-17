import express, { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { body } from "express-validator";
import { User } from "../models/user";
import { Article } from "../models/article";
import { NotFoundError } from "../errors/not-found-error";
import { Comment } from "../models/comment";

const router = express.Router();

router.post(
  "/api/articles/:articleId/comments",
  requireAuth,
  async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const user = await User.findById(req.currentUser!.id);
    const article = await Article.findById(articleId);
    if (!user || !article) {
      throw new NotFoundError();
    }
    const { text } = req.body;
    const comment = Comment.build({
      text,
      user: req.currentUser!.id,
      article: articleId,
    });
    await comment.save();

    //@ts-ignore
    article.comments.push(comment._id);
    await article.save();

    res.status(201).send(comment);
  }
);

export { router as postCommentRouter };
