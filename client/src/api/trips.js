import axios from "axios";

export const getTrips = async () => {
  const res = await axios.get("/api/trips", { withCredentials: true });
  return res.data;
};

export const createTrip = async (trip) => {
  const res = await axios.post("/api/trips", trip, { withCredentials: true });
  return res.data;
};

export const updateTrip = async (id, trip) => {
  const res = await axios.put(`/api/trips/${id}`, trip, { withCredentials: true });
  return res.data;
};

export const deleteTrip = async (id) => {
  await axios.delete(`/api/trips/${id}`, { withCredentials: true });
};
