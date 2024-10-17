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
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new NotFoundError();
    }
    const { interests, sources, keywords } = req.body;
    if (interests) existingUser.preferences.interests = interests;
    if (sources) existingUser.preferences.sources = sources;
    if (keywords?.include)
      existingUser.preferences.keywords!.include = keywords.include;
    await existingUser.save();
    res.status(200).send(existingUser);
  }
);

export { router as updateUserRouter };
