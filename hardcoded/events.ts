export interface Event {
    id: number;
    name: string;
    date: string;
    time: string;
    venue: string;
    artist: string;
    image: string;
  }
  
  export const events: Event[] = [
    {
      id: 1,
      name: "Rock Festival 2025",
      date: "2025-02-15",
      time: "7:00 PM",
      venue: "Madison Square Garden",
      artist: "The Rockers",
      image: "/images/rock-festival.jpg",
    },
    {
      id: 2,
      name: "Jazz Night",
      date: "2025-03-10",
      time: "8:00 PM",
      venue: "Blue Note Jazz Club",
      artist: "Smooth Jazz Band",
      image: "/images/jazz-night.jpg",
    },
    {
      id: 3,
      name: "Pop Extravaganza",
      date: "2025-04-05",
      time: "6:00 PM",
      venue: "Staples Center",
      artist: "Pop Queens",
      image: "/images/pop-extravaganza.jpg",
    },
  ];
  