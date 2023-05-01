// Package
import bcrypt from "bcrypt";

// Model
import AuthModel from "../Model/AuthModel.js";
import UserInfoModel from "../Model/UserInfoModel.js";

const Auth = {
  _Login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const hasUser = await AuthModel.findOne({
        username: username.toLowerCase(),
      });

      if (hasUser) {
        const validPassword = await bcrypt.compare(password, hasUser.password);

        if (validPassword) {
          res.json({
            success: true,
            message: "Logged In.",
            user: hasUser._id.valueOf(),
            role: hasUser.role,
          });
        } else {
          res.json({
            success: false,
            message: "Password is Incorrect.",
          });
        }
      } else {
        res.json({
          success: false,
          message: "User does not exist.",
        });
      }
    } catch (err) {
      res.json(err);
    }
  },
  _Register: async (req, res) => {
    try {
      const { username, password, role, firstName, lastName, email } = req.body;

      if (username !== "" && password !== "" && role !== "") {
        const account = await AuthModel.create({
          ...AuthModel,
          ...req.body,
        });

        if (firstName !== "" && lastName !== "" && email !== "") {
          await UserInfoModel.create({
            ...UserInfoModel,
            accountId: account._id.valueOf(),
            firstName,
            lastName,
            email,
            token: {
              regular: 0,
              brainPop: 0,
            },
          });
          res.json({ success: true, message: "Registration complete." });
        } else {
          await AuthModel.deleteOne({ _id: account._id });
          res.json({
            success: false,
            message: "User Info cannot be empty.",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Username & Password cannot be empty.",
        });
      }
    } catch (err) {
      res.json({
        success: false,
        data: {
          ...err.keyValue,
        },
      });
    }
  },
};

export default Auth;
