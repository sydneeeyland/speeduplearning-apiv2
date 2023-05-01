import mongoose from "mongoose";

const ScheduleModel = mongoose.Schema(
  {
    teacherId: {
      type: String,
      require: [true, "Please provide teacherId"],
    },
    teacherName: {
      type: String,
      require: [true, "Please provide teacherName"],
    },
    date: {
      type: String,
      require: [true, "Please provide date"],
    },
    time: {
      type: String,
      require: [true, "Please provide time"],
    },
    typeOfClass: {
      type: String,
      require: [true, "Please provide typeOfClass"],
    },
    status: {
      type: String,
      require: [true, "Please provide status"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("schedule", ScheduleModel);
