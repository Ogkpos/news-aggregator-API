import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { requireAuth } from "../middlewares/require-auth";
import { NotFoundError } from "../errors/not-found-error";

const router = express.Router();

router.delete(
  "/api/users/remove-saved-article/:articleId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new NotFoundError();
    }

    user.savedArticles = user.savedArticles.filter(
      (savedId) => savedId.toString() !== articleId
    );

    await user.save();

    res.send(user);
  }
);

export { router as deleteSavedArticleRouter };
