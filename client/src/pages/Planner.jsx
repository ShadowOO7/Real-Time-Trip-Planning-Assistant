import { useState, useEffect } from "react";
import { getTrips, createTrip, updateTrip, deleteTrip } from "../api/trips";
import AddTripModal from "../components/Planner/AddTripModal";
import EditTripModal from "../components/Planner/EditTripModal";

export default function Planner() {
  const [trips, setTrips] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getTrips();
      setTrips(data);
    })();
  }, []);

  async function handleAddTrip(newTrip) {
    const trip = await createTrip(newTrip);
    setTrips([trip, ...trips]);
    setIsAddOpen(false);
  }

  async function handleEditTrip(updated) {
    const trip = await updateTrip(updated._id, updated);
    setTrips(trips.map(t => t._id === trip._id ? trip : t));
    setIsEditOpen(false);
  }

  async function handleDeleteTrip(id) {
    await deleteTrip(id);
    setTrips(trips.filter(t => t._id !== id));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Trips</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add New Trip */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="border-2 border-dashed rounded-xl p-6 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600"
        >
          ➕ Add New Trip
        </button>

        {/* Existing trips */}
        {trips.map(trip => (
          <div key={trip._id} className="bg-white shadow rounded-xl p-4">
            <h2 className="font-semibold text-lg">{trip.title}</h2>
            <p className="text-gray-500">{trip.destination}</p>
            <p className="text-sm text-gray-400">
              {trip.startDate?.slice(0, 10)} → {trip.endDate?.slice(0, 10)}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setSelectedTrip(trip); setIsEditOpen(true); }}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTrip(trip._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddTripModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleAddTrip} />
      <EditTripModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} trip={selectedTrip} onSave={handleEditTrip} />
    </div>
  );
}
