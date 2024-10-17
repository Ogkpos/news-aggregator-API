import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { signupRouter } from "./routes/signup";
import { currentuserRouter } from "./routes/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { signinRouter } from "./routes/signin";
import cookieSession from "cookie-session";
import { verifyOTPRouter } from "./routes/verify-otp";
import { emailVerificationRouter } from "./routes/email-verification";
import { updateUserRouter } from "./routes/update-user";
import { signoutRouter } from "./routes/signout";
import { aggregatedNewsRouter } from "./routes/aggregated-news";
import { getSpecificNewsRouter } from "./routes/get-specific-aggregated-news";
import { saveArticleRouter } from "./routes/save-an-article";
import { getSavedArticleRouter } from "./routes/get-saved-article";
import { deleteSavedArticleRouter } from "./routes/delete-saved-article";
import { shareArticleRouter } from "./routes/share-article";
import { getShareArticleRouter } from "./routes/get-shared-article";
import { postCommentRouter } from "./routes/post-a-comment";
import { getCommentRouter } from "./routes/retrieve-comment-for-article";
// import cors from "cors";

const app = express();

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentuserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(verifyOTPRouter);
// app.use(emailVerificationRouter);
app.use(updateUserRouter);
app.use(signoutRouter);
app.use(aggregatedNewsRouter);
app.use(getSpecificNewsRouter);
app.use(saveArticleRouter);
app.use(getSavedArticleRouter);
app.use(deleteSavedArticleRouter);
app.use(shareArticleRouter);
app.use(getShareArticleRouter);
app.use(postCommentRouter);
app.use(getCommentRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

// @ts-ignore
app.use(errorHandler!);

export { app };
