import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    videos: [],
  },
  reducers: {
    saveVideos: (state, action) => {
      state.videos = action.payload;
    },
    clearVideos: (state) => {
      state.videos = [];
    },
  },
});

export const { saveVideos, clearVideos } = videoSlice.actions;

export default videoSlice.reducer;
