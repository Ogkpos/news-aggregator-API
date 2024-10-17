import express, { Request, Response, NextFunction } from "express";

import { requireAuth } from "../middlewares/require-auth";
import mongoose from "mongoose";

import { User } from "../models/user";
import { NotFoundError } from "../errors/not-found-error";
import { SharedArticle } from "../models/shared-article";
import { Article } from "../models/article";

const router = express.Router();

router.get(
  "/api/articles/received",
  requireAuth,
  async (req: Request, res: Response) => {
    const sharedArticle = await SharedArticle.find({
      receiver: req.currentUser!.id,
    })
      .populate("article")
      .populate("sender");

    if (!sharedArticle) {
      throw new NotFoundError();
    }

    res.send(sharedArticle);
  }
);

export { router as getShareArticleRouter };
