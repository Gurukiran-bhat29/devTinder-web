import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

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
  console.log("Connections:", connections);
  return (
    <div className="text-center mt-10">
      <label className="font-bold text-xl">Connections</label>

      {connections.map((connection) => {
        const { _id, firstName, lastName, emailId, photoUrl, about } =
          connection;
        return (
          <div key={_id} className="flex m-4 p-4 border rounded-md border-gray-500">
            <div>
              <img alt="photo" className="w-20 h-20" src={photoUrl} />
            </div>
            <div className="text-left mx-4">
              <h2 className="font-bold text-xl">
                {firstName} {lastName}
              </h2>
              <p>{about}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
