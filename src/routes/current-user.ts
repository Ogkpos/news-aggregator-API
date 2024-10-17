import express, { Request, Response, NextFunction } from "express";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();
router.get(
  "/api/users/currentuser",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentuserRouter };
