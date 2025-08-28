import ChatMessage from "../models/ChatMessage.js";


export async function getMessages(req, res, next) {
  try {
    const { tripId } = req.params;
    const msgs = await ChatMessage.find({ tripId }).sort({ createdAt: 1 }).limit(200);
    res.json(msgs);
  } catch (e) { next(e); }
}
