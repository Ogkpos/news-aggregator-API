import mongoose from "mongoose";

interface ArticleAttrs {
  title: string;
  author: string;
  source: string;
  url: any;
  publishedAt: Date;
  content: string;
  keywords: string[];
  createdAt: Date;
}
export interface ArticleDoc extends mongoose.Document {
  title: string;
  author: string;
  source: string;
  url: string;
  publishedAt: Date;
  content: string;
  keywords: string[];
  createdAt: Date;
  comments: mongoose.Types.ObjectId;
}
interface ArticleModel extends mongoose.Model<ArticleDoc> {
  build(attrs: ArticleAttrs): ArticleDoc;
}

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    source: { type: String },
    url: { type: String },
    content: { type: String },
    keywords: { type: Array },
    publishedAt: { type: Date },
    createdAt: { type: Date },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
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

articleSchema.statics.build = (attrs: ArticleAttrs) => {
  return new Article(attrs);
};

const Article = mongoose.model<ArticleDoc, ArticleModel>(
  "Article",
  articleSchema
);

export { Article };
