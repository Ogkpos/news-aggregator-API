import mongoose from "mongoose";

interface CommentAttrs {
  text: string;
  user: string; //   mongoose.Types.ObjectId;
  article: string; //mongoose.Types.ObjectId;
}
interface CommentDoc extends mongoose.Document {
  text: string;
  user: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
}
interface CommentModel extends mongoose.Model<CommentAttrs, CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment };
