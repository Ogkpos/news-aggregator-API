import express, { Request, Response, NextFunction } from "express";
import { Article } from "../models/article";
import { User } from "../models/user";
import { requireAuth } from "../middlewares/require-auth";
import { NotFoundError } from "../errors/not-found-error";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/users/save-article",
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser!.id).populate(
      "savedArticles"
    );
    if (!user) {
      throw new NotFoundError();
    }

    const savedArticles = await Promise.all(
      user.savedArticles.map(async (article) => {
        return await Article.findById(article);
      })
    );
    res.send(savedArticles);
  }
);

export { router as getSavedArticleRouter };
