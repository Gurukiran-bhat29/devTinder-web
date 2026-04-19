import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Body from "./components/Body.jsx";
import { Provider } from "react-redux";
import appStore from "./utils/appStore.js";

const Login = lazy(() => import("./components/Login.jsx"));
const Profile = lazy(() => import("./components/Profile.jsx"));
const Feed = lazy(() => import("./components/Feed.jsx"));
const Connections = lazy(() => import("./components/Connections.jsx"));
const Requests = lazy(() => import("./components/Requests.jsx"));
const Premium = lazy(() => import("./components/Premiun.jsx"));
const Chat = lazy(() => import("./components/Chat.jsx"));
const VideoContainer = lazy(() => import("./components/VideoContainer.jsx"));
const WatchPage = lazy(() => import("./components/WatchPage.jsx"));
const SearchResult = lazy(() => import("./components/SearchResult.jsx"));

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/videos" element={<VideoContainer />} />
              <Route path="/watch" element={<WatchPage />} />
              <Route path="/results" element={<SearchResult />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
