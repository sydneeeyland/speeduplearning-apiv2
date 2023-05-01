import mongoose from "mongoose";

const UserInfoModel = mongoose.Schema(
  {
    accountId: {
      type: String,
      require: [true, "Please provide accountId"],
    },
    firstName: {
      type: String,
      require: [true, "Please provide firstName"],
    },
    lastName: {
      type: String,
      require: [true, "Please provide lastName"],
    },
    email: {
      type: String,
      require: [true, "Please provide email"],
    },
    token: {
      regular: {
        type: String,
        require: [true, "Please provide regular_token"],
      },
      brainPop: {
        type: String,
        require: [true, "Please provide brainpop_token"],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserInfo", UserInfoModel);
