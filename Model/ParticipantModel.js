import mongoose from "mongoose";

const ParticipantModel = mongoose.Schema(
  {
    scheduleId: {
      type: String,
      require: [true, "Please provide scheduleId"],
    },
    userId: {
      type: String,
      require: [true, "Please provide accountId"],
    },
    student: {
      type: String,
      require: [true, "Please provide student"],
    },
    note: {
      type: String,
      require: [true, "Please provide note"],
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

export default mongoose.model("participant", ParticipantModel);
