// frontend/src/components/Planner/AddTripModal.jsx
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function AddTripModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    items: [], // Now an array for multiple destinations/items
    startDate: "",
    endDate: "",
  });
  const [currentItem, setCurrentItem] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddItem() {
    if (currentItem.trim() !== "") {
      setForm({ ...form, items: [...form.items, currentItem.trim()] });
      setCurrentItem("");
    }
  }

  function handleRemoveItem(index) {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-10">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Add New Trip
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Trip Title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentItem}
                  onChange={(e) => setCurrentItem(e.target.value)}
                  placeholder="Add a place or activity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {form.items.length > 0 && (
                <div className="mt-2 space-y-1">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                    >
                      <span className="text-gray-800">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Finalize Trip
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </Transition>
  );
}