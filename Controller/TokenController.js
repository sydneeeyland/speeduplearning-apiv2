// Model
import UserInfoModel from "../Model/UserInfoModel.js";
import TokenModel from "../Model/TokenModel.js";

const Token = {
  _Update: async (req, res) => {
    try {
      const { reqId, accountId, type, amount } = req.body;

      const hasUser = await UserInfoModel.findOne({ accountId });
      const hasTokenRequest = await TokenModel.findOne({ _id: reqId });

      if (hasTokenRequest.status === "Pending") {
        await TokenModel.updateOne({ _id: reqId }, { status: "Approved" });
        await UserInfoModel.updateOne(
          { accountId },
          type === "Brain Pop"
            ? {
                token: {
                  regular: hasUser.token.regular,
                  brainPop: Number(hasUser.token.brainPop) + Number(amount),
                },
              }
            : {
                token: {
                  regular: Number(hasUser.token.regular) + Number(amount),
                  brainPop: hasUser.token.brainPop,
                },
              }
        );

        res.json({
          success: true,
          message: "Token request has been approved.",
        });
      } else {
        res.json({
          success: false,
          message: "Token request is already approved.",
        });
      }
    } catch (err) {
      res.json(err);
    }
  },
  _Create: async (req, res) => {
    try {
      const { accountId, type, amount, referrence } = req.body;

      const hasPendingRequest = await TokenModel.findOne({
        accountId: accountId,
        amount: amount,
        referrence: referrence,
        status: "Pending",
      });

      const hasUser = await UserInfoModel.findOne({ accountId });

      if (hasPendingRequest === null) {
        await TokenModel.create({
          ...TokenModel,
          accountId,
          type,
          amount,
          referrence,
          status: "Pending",
          user: hasUser,
        });

        res.json({
          success: true,
          message: "Token request has been submitted.",
        });
      } else {
        res.json({
          success: true,
          message:
            "You have existing token request similar to the data you are trying to submit.",
        });
      }
    } catch (err) {
      res.json(err);
    }
  },
};

export default Token;
