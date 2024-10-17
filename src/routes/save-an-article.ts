import express, { Request, Response, NextFunction } from "express";
import { Article } from "../models/article";
import { User } from "../models/user";
import { requireAuth } from "../middlewares/require-auth";
import { NotFoundError } from "../errors/not-found-error";
import { body } from "express-validator";
import mongoose from "mongoose";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/save-article",
  requireAuth,
  [
    body("articleId")
      .custom((id) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("Invalid user Id"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { articleId }: any = req.body;
    const article = await Article.findById(articleId);
    if (!article) {
      throw new NotFoundError();
    }
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }

    if (!user.savedArticles.includes(articleId)) {
      user.savedArticles.push(article.id);
      await user.save();
    }
    res.send(user);
  }
);

export { router as saveArticleRouter };
