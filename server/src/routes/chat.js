import { Router } from "express";
import { getMessages } from "../controllers/chatController.js";

const r = Router();
r.get("/:tripId", getMessages);
export default r;
