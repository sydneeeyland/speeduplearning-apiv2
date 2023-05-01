import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AuthModel = mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please provide username"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Please provide password"],
    },
    role: {
      type: String,
      require: [true, "Please provide role"],
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt String Password
AuthModel.pre("validate", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("Accounts", AuthModel);
