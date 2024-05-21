import { collection, db, getDocs } from "../Operations/firebaseConfig";
import React, { createContext, useState, useEffect } from "react";

const DataContext = createContext({
  attendees: [],
  events: [],
  chatRooms: [],
  fetchContent: () => {},
});

const EventsDataProvider = ({ children }) => {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [chatsRooms, setChatRooms] = useState();

  useEffect(() => {
    const fetchContent = async () => {
      const attendeesRef = collection(db, "attendees");
      const attendeesSnapshot = await getDocs(attendeesRef);
      const attendeesData = attendeesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // console.log("api data: ", attendeesData)
      setAttendees(attendeesData);
    };

    const fetchEvents = async () => {
      const eventsRef = collection(db, "events");
      const eventSnapshot = await getDocs(eventsRef);
      const eventsData = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(eventsData);
    };

    const fetchChats = async () => {
      const rooms = collection(db, "chatRooms");
      const roomSnap = await getDocs(rooms);
      const roomData = roomSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
     // console.log("api data: ", roonData)

      setChatRooms(roomData);
    };
    fetchChats();
    fetchEvents();
    fetchContent();
  }, []);

  return (
    <DataContext.Provider value={{ attendees, events, chatsRooms }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, EventsDataProvider };
