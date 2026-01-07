import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (error) {
      if (error?.status === 401) {
        return navigate("/login");
      }
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-base-300">
        <NavBar />
      </div>
      <div className="flex-1 overflow-auto mt-24 mb-40 md:mb-24">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Body;
