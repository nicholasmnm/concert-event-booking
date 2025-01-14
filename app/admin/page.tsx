"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Event } from "@/types/event";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster
import Header from "../components/header";

export default function AdminPage() {
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    name: "",
    date: "",
    time: "",
    venue: "",
    artist: "",
    image: "",
  });

  const [eventList, setEventList] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Fetch events from Firestore
  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const eventsData: Event[] = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Make sure to extract the document ID
      ...doc.data(),
    })) as Event[];
    setEventList(eventsData);
  };

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Handle event creation
  const handleCreateEvent = async () => {
    if (
      newEvent.name &&
      newEvent.date &&
      newEvent.time &&
      newEvent.venue &&
      newEvent.artist &&
      newEvent.image
    ) {
      // Log the event data before adding to Firestore
      console.log("Creating event with data:", newEvent);

      // Remove the `id` before creating the event, Firestore will generate it
      const { id, ...eventDataWithoutId } = newEvent;

      // Create a new event in Firestore and get the docRef (document reference)
      const docRef = await addDoc(collection(db, "events"), eventDataWithoutId);

      // Log the docRef to see the generated ID
      console.log("Event created with Firestore document ID:", docRef.id);

      // Set the event ID in the newEvent state to the generated Firestore document ID
      const createdEvent = { ...eventDataWithoutId, id: docRef.id };

      // Log the created event data
      console.log("Created event with ID:", createdEvent);

      // Update the event list with the new event, including its ID
      setEventList((prevList) => [...prevList, createdEvent]);

      // Show success toast
      toast.success(`Event "${newEvent.name}" created successfully!`);

      // Reset the form state, including setting the id to the newly created document ID
      setNewEvent({
        id: docRef.id, // This is where the Firestore doc ID gets assigned
        name: "",
        date: "",
        time: "",
        venue: "",
        artist: "",
        image: "",
      });

      // Log the newEvent after reset
      console.log("Reset newEvent state:", createdEvent); // Log the state after resetting
    } else {
      toast.error("Please fill in all the fields.");
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (id: string) => {
    const eventToDelete = eventList.find((event) => event.id === id);
    if (eventToDelete) {
      await deleteDoc(doc(db, "events", id));
      setEventList(eventList.filter((event) => event.id !== id));
      toast.success(`Event "${eventToDelete.name}" has been deleted.`);
    }
  };

  // Handle event edit (populate form with current event details)
  const handleEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setNewEvent({ ...event });
  };

  // Save edited event
  const handleSaveEdit = async () => {
    const { id, ...eventData } = newEvent; // Remove id for update
    const eventRef = doc(db, "events", editingEventId!);
    await updateDoc(eventRef, eventData); // Update event
    setEventList(
      eventList.map((event) => (event.id === editingEventId ? { ...event, ...eventData } : event))
    );
    toast.success(`Event "${newEvent.name}" updated successfully!`);
    setEditingEventId(null); // Clear editing mode
    setNewEvent({
      id: "",
      name: "",
      date: "",
      time: "",
      venue: "",
      artist: "",
      image: "",
    }); // Reset form
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-r from-purple-900 to-black p-8">
        <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-xl shadow-xl overflow-hidden p-8">
          <h1 className="text-4xl font-extrabold text-center mb-8">Admin Dashboard</h1>

          {/* Create/Edit Event Section */}
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingEventId ? "Edit Event" : "Create New Event"}
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["name", "date", "time", "venue", "artist", "image"].map((field) => (
                  <div key={field}>
                    <label
                      className="block text-gray-300 font-medium capitalize"
                      htmlFor={field}
                    >
                      {field === "image" ? "Event Image URL" : field}
                    </label>
                    <input
                      type={field === "date" ? "date" : field === "time" ? "time" : "text"}
                      name={field}
                      id={field}
                      className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={(newEvent as any)[field]}
                      onChange={handleChange} />
                  </div>
                ))}
              </div>

              <button
                onClick={editingEventId ? handleSaveEdit : handleCreateEvent}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                {editingEventId ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </div>

          {/* Event Table Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Manage Events</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-300">
                <thead>
                  <tr>
                    <th className="border-b border-gray-600 px-4 py-2 text-left">Event Name</th>
                    <th className="border-b border-gray-600 px-4 py-2 text-left">Date</th>
                    <th className="border-b border-gray-600 px-4 py-2 text-left">Time</th>
                    <th className="border-b border-gray-600 px-4 py-2 text-left">Venue</th>
                    <th className="border-b border-gray-600 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventList.map((event) => (
                    <tr key={event.id} className="border-b border-gray-600 hover:bg-gray-700">
                      <td className="px-4 py-2">{event.name}</td>
                      <td className="px-4 py-2">{event.date}</td>
                      <td className="px-4 py-2">{event.time}</td>
                      <td className="px-4 py-2">{event.venue}</td>
                      <td className="px-4 py-2 flex gap-4">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-400 hover:text-blue-600 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-400 hover:text-red-600 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {eventList.length === 0 && (
              <p className="mt-4 text-gray-400 text-center">No events available</p>
            )}
          </div>
        </div>

        {/* Toaster container for toast notifications */}
        <Toaster />
      </main></>
  );
}
