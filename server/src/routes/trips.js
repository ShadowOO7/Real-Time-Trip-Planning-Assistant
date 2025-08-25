import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createTrip, getTrips, updateTrip, deleteTrip } from "../controllers/tripController.js";

const r = Router();

r.use(requireAuth); // protect all trip routes

r.get("/", getTrips);
r.post("/", createTrip);
r.put("/:id", updateTrip);
r.delete("/:id", deleteTrip);

export default r;
