import mongoose from "mongoose";

const Token = mongoose.Schema(
  {
    accountId: {
      type: String,
      require: [true, "Please provide accountId"],
    },
    type: {
      type: String,
      require: [true, "Please provide type"],
    },
    amount: {
      type: String,
      require: [true, "Please provide amount"],
    },
    referrence: {
      type: String,
      require: [true, "Please provide referrence"],
    },
    status: {
      type: String,
      require: [true, "Please provide status"],
    },
    user: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Token", Token);
