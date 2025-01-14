"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase"; // Import Firestore
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { use } from "react"; // Import `use` from React

interface EventPageProps {
  params: { id: string }; // Explicitly typing the `params` prop
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap `params` correctly using `use()`
  const { id } = use(params); // Await the Promise and get `id`

  const [event, setEvent] = useState<any>(null); // State to store the event data
  const [tickets, setTickets] = useState(1); // State for the number of tickets
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "events", id); // Reference to the event document
        const eventSnap = await getDoc(eventRef); // Fetch the document
        
        if (eventSnap.exists()) {
          setEvent(eventSnap.data()); // Set the event data
        } else {
          notFound(); // If the event does not exist, show 404
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        notFound(); // Handle any errors by showing 404
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchEvent();
  }, [id]); // Fetch event data whenever the `id` changes

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    ); // Show loading indicator while fetching data
  }

  if (!event) {
    return notFound(); // Show 404 if event not found
  }

  const handleBooking = () => {
    setSuccessMessage(
      `Successfully booked ${tickets} ticket(s) for ${event.name}!`
    );
    console.log({
      eventId: event.id,
      eventName: event.name,
      tickets,
    });
  };

  return (
    <><main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover rounded-t-lg" />
        <div className="p-6">
          <h1 className="text-4xl font-semibold text-black">{event.name}</h1>
          <p className="text-lg text-gray-800 mt-2">{event.artist}</p>
          <p className="text-gray-600 mt-2">
            {event.date} • {event.time}
          </p>
          <p className="text-gray-600 mt-2">{event.venue}</p>
          <p className="text-gray-700 mt-4">{event.description}</p> {/* Use description from Firebase */}

          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-black">Book Tickets</h2>
            <div className="mt-4">
              <label
                htmlFor="tickets"
                className="block text-black font-medium"
              >
                Number of Tickets
              </label>
              <input
                id="tickets"
                type="number"
                min="1"
                value={tickets}
                onChange={(e) => setTickets(Number(e.target.value))}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button
              onClick={handleBooking}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out"
            >
              Book Now
            </button>
            {successMessage && (
              <p className="mt-4 text-green-600 font-medium">{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </main></>
  );
}
