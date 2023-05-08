// Model
import AuthModel from "../Model/AuthModel.js";
import UserInfoModel from "../Model/UserInfoModel.js";

const Booking = {
  _View: async (req, res) => {
    try {
      const { accountId } = req.body;
      let teachers = [];
      let BookingData = [];

      const GetTeachers = await AuthModel.find({ role: "teacher" });
      const hasUserInfo = await UserInfoModel.findOne({ accountId: accountId });

      if (GetTeachers.length > 0) {
        GetTeachers.map((key) => teachers.push(key._id.valueOf()));

        const GetTeachersInfo = await UserInfoModel.find({
          accountId: [...teachers],
        });
        GetTeachersInfo.map((key) =>
          BookingData.push({
            id: key.accountId,
            teacherName: `${key.firstName} ${key.lastName}`,
          })
        );

        res.json({ success: true, data: BookingData, user: hasUserInfo.token });
      } else {
        res.json({ success: true, message: "No Registered Teachers" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};

export default Booking;
