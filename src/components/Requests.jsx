import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((state) => state.request);
  const dispatch = useDispatch();

  const reviewRequest = async (status, requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        {
          withCredentials: true,
        }
      );
      // handle response
      if (res.status === 200) {
        // Refresh the requests list
        dispatch(removeRequest(requestId));
      }
    } catch (error) {
      console.error("Failed to review request:", error);
    }
  };

  const fetchRequests = async () => {
    const res = await axios.get(BASE_URL + "/user/requests/received", 
    {
      withCredentials: true,
    });
    dispatch(addRequest(res.data.data));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0) {
    return <label className="font-bold text-xl">No connection Found</label>;
  }

  return (
    <div className="text-center mt-10">
      <label className="font-bold text-xl">Requests</label>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className="flex m-4 p-4 border rounded-md border-gray-500 w-1/2 justify-between"
          >
            <div>
              <img alt="photo" className="w-20 h-20" src={photoUrl} />
            </div>
            <div className="text-left mx-4">
              <h2 className="font-bold text-xl">
                {firstName} {lastName}
              </h2>
              <p>{about}</p>
            </div>
            <div>
              <button onClick={() => reviewRequest("rejected", request._id)} className="btn btn-primary">Reject</button>
              <button onClick={() => reviewRequest("accepted", request._id)} className="btn btn-secondary ml-2">Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
