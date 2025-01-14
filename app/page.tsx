"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/header";
import { db } from "@/lib/firebase"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import { toast, Toaster } from "react-hot-toast"; // For notifications

interface Event {
  id: string;
  name: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  image: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]); // State for events
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events")); // Fetch events collection
        const fetchedEvents: Event[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(fetchedEvents); // Update events state
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events.");
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <main className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-black">
          🔥 Upcoming Concerts - Selling Out Fast! 🔥
        </h1>
        {loading ? (
          <p className="text-center text-black">Loading events...</p> // Show loading message
        ) : events.length === 0 ? (
          <p className="text-center text-black">No upcoming events found.</p> // Show no events message
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex-1">
                    <h2
                      className="text-xl font-semibold text-black line-clamp-3"
                      style={{
                        minHeight: "4.5rem", // 1.5rem per line * 3 lines
                        lineHeight: "1.5rem", // Ensure consistent spacing between lines
                      }}
                    >
                      {event.name}
                    </h2>
                    <p className="text-black">{event.artist}</p>
                    <p className="text-black">
                      {event.date} • {event.time}
                    </p>
                    <p className="text-black">{event.venue}</p>
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <button className="mt-4 w-full bg-gradient-to-r from-purple-900 to-black font-bold text-white p-3 rounded-lg shadow-lg transform hover:scale-105 transition duration-200">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
