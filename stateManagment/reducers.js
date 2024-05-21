import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  attendees: []
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setAttendees(state, action) {
      state.attendees = action.payload;
    },
    setEvents(state, action) {
      state.events = action.payload;
    }
  }
});

export const { setAttendees, setEvents } = dataSlice.actions;
export default dataSlice.reducer;
