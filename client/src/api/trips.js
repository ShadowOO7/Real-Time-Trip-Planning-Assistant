import api from "./http";

export const getTrips = async () => {
  const res = await api.get("/trips");
  return res.data;
};

export const createTrip = async (trip) => {
  const res = await api.post("/trips", trip);
  return res.data;
};

export const updateTrip = async (id, trip) => {
  const res = await api.put(`/trips/${id}`, trip);
  return res.data;
};

export const deleteTrip = async (id) => {
  await api.delete(`/trips/${id}`);
};
