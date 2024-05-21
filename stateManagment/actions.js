import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, db, getDocs } from "../Operations/firebaseConfig";

// Thunk action creator to fetch attendees and events
export const fetchAttendeesAndEvents = createAsyncThunk(
  'data/fetchAttendeesAndEvents',
  async () => {
    try {
      const attendeesRef = collection(db, "attendees");
      const attendeesSnapshot = await getDocs(attendeesRef);
      const attendeesData = attendeesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // console.log("Redux Attendee Data: ", attendeesData)

      return { attendees: attendeesData, events: eventsData };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
);

// Create slice
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    events: [],
    attendees: [],
    status: 'idle', // Status to track loading/error states
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling pending state
      .addCase(fetchAttendeesAndEvents.pending, (state) => {
        state.status = 'loading';
      })
      // Handling success state
      .addCase(fetchAttendeesAndEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendees = action.payload.attendees;
        state.events = action.payload.events;
      })
      // Handling error state
      .addCase(fetchAttendeesAndEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Export action creators and reducer
export const { setAttendees, setEvents } = dataSlice.actions;
export default dataSlice.reducer;
