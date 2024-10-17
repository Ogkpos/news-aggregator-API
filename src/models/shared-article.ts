import mongoose from "mongoose";

interface SharedArticleAttrs {
  receiver: mongoose.Types.ObjectId;
  sender: string;
  article: mongoose.Types.ObjectId;
  sharedAt?: Date;
}

interface SharedArticleDoc extends mongoose.Document {
  receiver: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  article: mongoose.Types.ObjectId;
  sharedAt: Date;
}

interface SharedArticleModel extends mongoose.Model<SharedArticleDoc> {
  build(attrs: SharedArticleAttrs): SharedArticleDoc;
}

const sharedArticleSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    sharedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

sharedArticleSchema.statics.build = (attrs: SharedArticleAttrs) => {
  return new SharedArticle(attrs);
};

const SharedArticle = mongoose.model<SharedArticleDoc, SharedArticleModel>(
  "SharedArticle",
  sharedArticleSchema
);

export { SharedArticle };
