import mongoose from "mongoose";
import { Password } from "../services/password";

interface Preferences {
  interests?: string[];
  sources?: string[];
  keywords?: {
    include?: string[];
  };
}

interface Notifications {
  breakingNews?: {
    enabled?: boolean;
    categories?: string[];
    sources?: string[];
    keywords?: string[];
  };
  dailyDigest?: {
    enabled?: boolean;
    time?: Date;
    categories?: string[];
  };
}

interface UserAttrs {
  username: string;
  email: string;
  password: string;
  preferences?: Preferences;
  notifications?: Notifications;
}
interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  otp: any;
  otpExpiresAt: number;
  verified: boolean;
  updatedAt: Date;
  createdAt: Date;
  preferences: Preferences;
  savedArticles: mongoose.Types.ObjectId[];
  notifications: Notifications;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a usernmae"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    otpExpiresAt: Number,
    otp: {
      type: Number,
    },
    verified: Boolean,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    preferences: {
      interests: { type: [String], default: [] },
      sources: { type: [String], default: [] },
      keywords: {
        include: { type: [String], default: [] },
      },
    },
    savedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    notifications: {
      breakingNews: {
        enabled: {
          type: Boolean,
          default: true,
        },
        categories: {
          type: [String],
          default: [],
        },
        sources: {
          type: [String],
          default: [],
        },
        keywords: {
          type: [String],
          default: [],
        },
      },
      dailyDigest: {
        enabled: {
          type: Boolean,
          default: true,
        },
        time: {
          type: String,
          default: "08:00",
        },
        categories: {
          type: [String],
          default: [],
        },
      },
    },
  },
  {
    toJSON: {
      transform(doc, ret, options: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.otpExpiresAt;
        delete ret.otp;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    ...attrs,
    preferences: {
      interests: attrs.preferences?.interests || [],
      sources: attrs.preferences?.sources || [],
      keywords: {
        include: attrs.preferences?.keywords?.include || [],
      },
    },
    notifications: {
      breakingNews: {
        enabled: attrs.notifications?.breakingNews?.enabled || true,
        categories: attrs.notifications?.breakingNews?.categories || [],
        sources: attrs.notifications?.breakingNews?.sources || [],
        keywords: attrs.notifications?.breakingNews?.keywords || [],
      },
      dailyDigest: {
        enabled: attrs.notifications?.dailyDigest?.enabled || true,
        categories: attrs.notifications?.dailyDigest?.categories || [],
        time: attrs.notifications?.dailyDigest?.time || "08:00",
      },
    },
  });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
