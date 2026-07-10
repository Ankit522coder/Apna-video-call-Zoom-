import { Router} from "express";
import { addToHistory, getUserHistory, login, register, validateMeeting } from "../controllers/user.controller.js";


const router = Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post(getUserHistory)
router.route("/get_user_activity").get(addToHistory)
router.route("/validate_meeting/:meetingCode").get(validateMeeting)

export default router;
