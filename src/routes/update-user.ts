import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { body, param } from "express-validator";
import { NotFoundError } from "../errors/not-found-error";
import { requireAuth } from "../middlewares/require-auth";
import mongoose from "mongoose";

const router = express.Router();

router.put(
  "/api/users/updateuser/:id",
  requireAuth,
  [
    param("id")
      .custom((id) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("Invalid user Id"),
    body("interests")
      .optional()
      .isArray()
      .withMessage("Interests must be an array"),
    body("sources")
      .optional()
      .isArray()
      .withMessage("Sources must be an array"),
    body("keywords.include")
      .optional()
      .isArray()
      .withMessage("Keywords must be an array"),
    body("notifications.breakingNews.enabled")
      .optional()
      .isBoolean()
      .withMessage("Enabled must be a boolean"),
    body("notifications.breakingNews.categories")
      .optional()
      .isArray()
      .withMessage("Categories must be an array"),
    body("notifications.breakingNews.sources")
      .optional()
      .isArray()
      .withMessage("Sources must be an array"),
    body("notifications.breakingNews.keywords")
      .optional()
      .isArray()
      .withMessage("Keywords must be an array"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new NotFoundError();
    }
    const { interests, sources, keywords, notifications } = req.body;
    if (interests) existingUser.preferences.interests = interests;
    if (sources) existingUser.preferences.sources = sources;
    if (keywords?.include)
      existingUser.preferences.keywords!.include = keywords.include;

    if (notifications?.breakingNews) {
      if (notifications.breakingNews.enabled !== undefined) {
        existingUser.notifications!.breakingNews!.enabled =
          notifications.breakingNews.enabled;
      }
      if (notifications.breakingNews.categories) {
        existingUser.notifications!.breakingNews!.categories =
          notifications.breakingNews.categories;
      }
      if (notifications.breakingNews.sources) {
        existingUser.notifications!.breakingNews!.sources =
          notifications.breakingNews.sources;
      }
      if (notifications.breakingNews.keywords) {
        existingUser.notifications!.breakingNews!.keywords =
          notifications.breakingNews.keywords;
      }
    }

    if (notifications?.dailyDigest) {
      if (notifications.dailyDigest.enabled !== undefined) {
        existingUser.notifications!.dailyDigest!.enabled =
          notifications.dailyDigest.enabled;
      }
      if (notifications.dailyDigest.categories) {
        existingUser.notifications!.dailyDigest!.categories =
          notifications.dailyDigest.categories;
      }
      if (notifications.dailyDigest.time) {
        existingUser.notifications!.dailyDigest!.time =
          notifications.dailyDigest.time;
      }
    }

    await existingUser.save();
    res.status(200).send(existingUser);
  }
);

export { router as updateUserRouter };
