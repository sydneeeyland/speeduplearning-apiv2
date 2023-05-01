// Package
import moment from "moment";

// Model
import ScheduleModel from "../Model/ScheduleModel.js";
import ParticipantModel from "../Model/ParticipantModel.js";
import UserInfoModel from "../Model/UserInfoModel.js";
import AuthModel from "../Model/AuthModel.js";

const ServerTodayDate = moment().format("MM/DD/YYYY");
const ServerTomorrowDate = moment().add(1, "day").format("MM/DD/YYYY");

async function CreateNewSchedule(
  teacherId,
  teacherName,
  date,
  time,
  typeOfClass,
  userId,
  student,
  note
) {
  const createSchedule = await ScheduleModel.create({
    ...ScheduleModel,
    teacherId,
    teacherName,
    date,
    time,
    typeOfClass,
    status: "Pending",
  });

  await ParticipantModel.create({
    ...ParticipantModel,
    scheduleId: createSchedule._id.valueOf(),
    userId,
    student,
    note,
    status: "Attending",
  });
}

async function UpdateUserToken(userId, res, typeOfClass) {
  const hasUser = await UserInfoModel.findOne({ accountId: userId });
  const token = {
    "Brain Pop (1 Participant)": {
      token: {
        brainPop: hasUser.token.brainPop - 1,
        regular: hasUser.token.regular,
      },
    },
    "Brain Pop (2 Participant)": {
      token: {
        brainPop: hasUser.token.brainPop - 1,
        regular: hasUser.token.regular,
      },
    },
    "Regular (1 Participant)": {
      token: {
        regular: hasUser.token.regular - 1,
        brainPop: hasUser.token.brainPop,
      },
    },
  };

  await UserInfoModel.updateOne({ accountId: userId }, token[typeOfClass]);
  res.json({ success: true, message: "Booking Success." });
}

const Schedule = {
  _View: async (req, res) => {
    // to continue due to need of user interface
    try {
      const { accountId, screen } = req.body;

      const hasUser = await AuthModel.findOne({ _id: accountId });

      if (hasUser.role === "student") {
        if (screen === "Home") {
          let sched = [];
          let HomeScreenData = {
            completed: 0,
            upcoming: 0,
            today: [],
            tomorrow: [],
          };
          const participation = await ParticipantModel.find({
            userId: accountId,
          });

          participation.map((key) => sched.push(key.scheduleId));

          const schedule = await ScheduleModel.find({
            _id: [...sched],
          });

          schedule.map((key) => {
            if (key.date === ServerTodayDate) {
              if (HomeScreenData.today.length < 2) {
                HomeScreenData.today.push(key);
              }
            } else if (key.date === ServerTomorrowDate) {
              if (HomeScreenData.tomorrow.length < 2) {
                HomeScreenData.tomorrow.push(key);
              }
            }

            if (key.status === "Pending" && key.date >= ServerTodayDate) {
              HomeScreenData.upcoming += 1;
            } else if (key.status === "Completed") {
              HomeScreenData.completed += 1;
            }
          });
          res.json({ success: true, data: HomeScreenData });
        } else if (screen === "Calendar") {
          let sched = [];
          let CalendarData = {
            dates: [],
            calendar: {},
          };

          const participation = await ParticipantModel.find({
            userId: accountId,
          });

          participation.map((key) => sched.push(key.scheduleId));

          const schedule = await ScheduleModel.find({
            _id: [...sched],
          });

          schedule.sort((a, b) => {
            if (a.date === b.date) {
              if (!CalendarData.dates.includes(a.date)) {
                CalendarData.dates.push(a.date);
              }
            } else {
              if (
                !CalendarData.dates.includes(a.date) ||
                !CalendarData.dates.includes(b.date)
              ) {
                CalendarData.dates.push(a.date);
              }
            }
          });

          for (let i = 0; i < CalendarData.dates.length; i++) {
            Object.assign(CalendarData.calendar, {
              [moment(Date.parse(CalendarData.dates[i])).format("YYYY-MM-DD")]:
                [],
            });

            schedule.map((key) => {
              if (key.date === CalendarData.dates[i]) {
                CalendarData.calendar[
                  moment(Date.parse(CalendarData.dates[i])).format("YYYY-MM-DD")
                ].push({
                  id: key._id.valueOf(),
                  teacherName: key.teacherName,
                  time: key.time,
                  typeOfClass: key.typeOfClass,
                  status: key.status,
                });
              }
            });
          }

          res.json({ success: true, data: CalendarData });
        }
      } else if (hasUser.role === "teacher") {
        if (screen === "Home") {
          let HomeData = {
            completed: 0,
            upcoming: 0,
            today: [],
            tomorrow: [],
          };

          const hasSchedule = await ScheduleModel.find({
            teacherId: accountId,
          });

          hasSchedule.map((key) => {
            if (key.date === ServerTodayDate) {
              if (HomeData.today.length < 2) {
                HomeData.today.push({
                  teacherName: "You",
                  date: key.date,
                  time: key.time,
                  typeOfClass: key.typeOfClass,
                });
              }
            } else if (key.date === ServerTomorrowDate) {
              if (HomeData.tomorrow.length < 2) {
                HomeData.tomorrow.push({
                  teacherName: "You",
                  date: key.date,
                  time: key.time,
                  typeOfClass: key.typeOfClass,
                });
              }
            }

            if (key.status === "Pending" && key.date >= ServerTodayDate)
              HomeData.upcoming += 1;
            else if (key.status === "Completed") HomeData.completed += 1;
          });
          res.json({ success: true, data: HomeData });
        } else if (screen === "Calendar") {
          let CalendarData = {
            calendar: {},
          };
          const hasSchedule = await ScheduleModel.find({
            teacherId: accountId,
          });

          for (let i = 0; i < hasSchedule.length; i++) {
            if (
              !CalendarData.calendar.hasOwnProperty(
                moment(Date.parse(hasSchedule[i].date)).format("YYYY-MM-DD")
              )
            ) {
              let calendarData = [];
              const hasParticipant = await ParticipantModel.find({
                scheduleId: hasSchedule[i]._id.valueOf(),
              });

              hasParticipant.map((key) => {
                calendarData.push({
                  id: hasSchedule[i]._id.valueOf(),
                  teacherName: key.student,
                  time: hasSchedule[i].time,
                  typeOfClass: hasSchedule[i].typeOfClass,
                  status: key.status,
                  note: key.note,
                });
              });

              Object.assign(CalendarData.calendar, {
                [moment(Date.parse(hasSchedule[i].date)).format("YYYY-MM-DD")]:
                  calendarData,
              });
            }
          }
          res.json({ success: true, data: CalendarData });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  _Update: async (req, res) => {
    // to continue due to need of user interface
    const { scheduleId } = req.body;

    try {
      await ScheduleModel.updateOne({ _id: scheduleId }, { ...req.body });
      res.json({ success: true, message: "Update success." });
    } catch (err) {
      res.json(err);
    }
  },
  _Create: async (req, res) => {
    try {
      const {
        teacherId,
        teacherName,
        date,
        time,
        typeOfClass,
        userId,
        student,
        note,
      } = req.body;

      const hasSchedule = await ScheduleModel.findOne({
        date: date,
        time: time,
        teacherId: teacherId,
      });

      if (
        hasSchedule === null &&
        (typeOfClass === "Brain Pop (1 Participant)" ||
          typeOfClass === "Regular (1 Participant)")
      ) {
        CreateNewSchedule(
          teacherId,
          teacherName,
          date,
          time,
          typeOfClass,
          userId,
          student,
          note
        );
        UpdateUserToken(userId, res, typeOfClass);
      } else if (typeOfClass === "Brain Pop (2 Participant)") {
        if (hasSchedule === null) {
          CreateNewSchedule(
            teacherId,
            teacherName,
            date,
            time,
            typeOfClass,
            userId,
            student,
            note
          );
          UpdateUserToken(userId, res, typeOfClass);
        } else {
          if (hasSchedule.typeOfClass === "Brain Pop (2 Participant)") {
            const participants = await ParticipantModel.find({
              scheduleId: hasSchedule._id.valueOf(),
            });

            if (participants.length < 2) {
              await ParticipantModel.create({
                ...ParticipantModel,
                scheduleId: hasSchedule._id.valueOf(),
                userId,
                student,
                note,
                status: "Attending",
              });
              UpdateUserToken(userId, res, typeOfClass);
            } else {
              res.json({
                success: false,
                message: "Schedule is already fully booked.",
              });
            }
          } else {
            res.json({
              success: false,
              message: "Chosen Time has already class booking.",
            });
          }
        }
      } else {
        res.json({ success: false, message: "Already Booked." });
      }
    } catch (err) {
      res.json(err);
    }
  },
};

export default Schedule;
