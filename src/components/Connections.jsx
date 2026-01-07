import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((state) => state.connection);
  const dispatch = useDispatch();

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) {
    return <label className="font-bold text-xl">No connection Found</label>;
  }
  
  return (
    <div className="text-center mt-6 md:mt-10 px-4">
      <label className="font-bold text-xl">Connections</label>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, about } =
          connection;
        return (
          <div key={_id} className="flex flex-col sm:flex-row items-center m-4 p-4 border rounded-md border-gray-500 w-full max-w-2xl mx-auto gap-4">
            <div className="flex-shrink-0">
              <img alt="photo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" src={photoUrl} />
            </div>
            <div className="text-center sm:text-left flex-1 mx-0 sm:mx-4">
              <h2 className="font-bold text-lg sm:text-xl">
                {firstName} {lastName}
              </h2>
              <p className="text-sm sm:text-base break-words">{about}</p>
            </div>
            <Link to={`/chat/${_id}`} className="flex-shrink-0">
              <button className="btn btn-primary btn-sm sm:btn-md">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
