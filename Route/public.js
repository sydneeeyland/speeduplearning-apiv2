// Package
import express from "express";

// Controller
import AuthController from "../Controller/AuthController.js";
import ScheduleController from "../Controller/ScheduleController.js";
import TokenController from "../Controller/TokenController.js";
import BookingController from "../Controller/BookingController.js";

// Variables
const Router = express.Router();

/**
 **  @desc    POST auth
 **  @route   POST /speedup/auth/[login, register]
 **  @access  public
 */
Router.post("/auth/login", AuthController._Login);
Router.post("/auth/register", AuthController._Register);

/**
 **  @desc    POST schedule
 **  @route   POST /speedup/schedule/[create, update, update_participant, view]
 **  @access  private
 */
Router.post("/schedule/create", ScheduleController._Create);
Router.post("/schedule/update", ScheduleController._Update);
Router.post(
  "/schedule/update_participant",
  ScheduleController._UpdateParticipant
);
Router.post("/schedule/view", ScheduleController._View);

/**
 **  @desc    POST booking
 **  @route   POST /speedup/booking/[view,]
 **  @access  public
 */
Router.post("/booking/view", BookingController._View);

/**
 **  @desc    POST schedule
 **  @route   POST /speedup/token/[create, update]
 **  @access  private
 */
Router.post("/token/create", TokenController._Create);
Router.post("/token/update", TokenController._Update);

export default Router;
