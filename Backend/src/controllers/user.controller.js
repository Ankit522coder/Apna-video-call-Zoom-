import httpStatus from "http-status";
import crypto from "node:crypto";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Meeting } from "../models/meeting.model.js";
import { isMeetingActive } from "./socketManager.js";


const login = async (req, res) => {

    const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({ message: "Please Provide Username and Password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Incorrect password" });
        }

        let token = crypto.randomBytes(20).toString("hex");

        user.token = token;
        await user.save();
        return res.status(httpStatus.OK).json({ token: token });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const register = async (req, res ) => {
    const { name, username, password } = req.body || {};

    if (!name || !username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Please send name, username, and password in JSON body",
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();

        return res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
};

const getUserHistory = async (req, res) => {
    const { token, meeting_code } = req.body || {};

    if (!token || !meeting_code) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Please provide token and meeting_code",
        });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid token",
            });
        }

        const meeting = await Meeting.create({
            user_id: user._id.toString(),
            meetingCode: meeting_code,
        });

        return res.status(httpStatus.CREATED).json(meeting);
    } catch (error) {
        console.error("Error adding activity:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Internal server error",
        });
    }
};

const addToHistory = async (req, res) => {
    const token = req.body?.token || req.query.token;

    if (!token) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Please provide token",
        });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid token",
            });
        }

        const meetings = await Meeting.find({ user_id: user._id.toString() }).sort({ date: -1 });

        return res.status(httpStatus.OK).json(meetings);
    } catch (error) {
        console.error("Error fetching activity:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Internal server error",
        });
    }
};

const validateMeeting = async (req, res) => {
    const meetingCode = req.params.meetingCode;

    if (!meetingCode) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Please provide meeting code",
        });
    }

    return res.status(httpStatus.OK).json({
        exists: isMeetingActive(meetingCode),
    });
};

export { login, register, getUserHistory, addToHistory, validateMeeting };