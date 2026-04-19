import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import videoReducer from "./videoSlice";
import searchReducer from "./searchSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer ,
    connection: connectionReducer,
    request: requestReducer,
    video: videoReducer,
    search: searchReducer,
  },
});

export default appStore;
