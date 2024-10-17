import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/require-auth";
import mongoose from "mongoose";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { NotFoundError } from "../errors/not-found-error";
import { SharedArticle } from "../models/shared-article";
import { Article } from "../models/article";

const router = express.Router();

router.post(
  "/api/articles/share",
  requireAuth,
  [
    body("receiverId")
      .custom((id) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("Invalid receiver Id"),
    body("articleId")
      .custom((id) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("Invalid article Id"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { receiverId, articleId } = req.body;
    const article = await Article.findById(articleId);
    const receiver = await User.findById(receiverId);

    if (!article || !receiver) {
      throw new NotFoundError();
    }
    const sharedArticle = SharedArticle.build({
      receiver: receiverId,
      sender: req.currentUser!.id,
      article: articleId,
    });

    await sharedArticle.save();
    res.status(200).send(sharedArticle);
  }
);

export { router as shareArticleRouter };
