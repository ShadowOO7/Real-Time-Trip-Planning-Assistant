import { Router } from "express";
import { suggestForNextTripItem } from "../services/suggest.js";

const r = Router();
// GET /api/suggest/next/:tripId -> [{title,address,lat,lng}, ...]
r.get("/next/:tripId", async (req, res, next) => {
  try {
    const out = await suggestForNextTripItem(req.params.tripId, 10);
    res.json(out);
  } catch (e) { next(e); }
});

export default r;
