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
    <div className="text-center mt-6 md:mt-10 px-4">
      <label className="font-bold text-xl">Requests</label>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row items-center m-4 p-4 border rounded-md border-gray-500 w-full max-w-2xl mx-auto gap-4"
          >
            <div className="flex-shrink-0">
              <img alt="photo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" src={photoUrl} />
            </div>
            <div className="text-center sm:text-left flex-1 mx-0 sm:mx-4">
              <h2 className="font-bold text-lg sm:text-xl">
                {firstName} {lastName}
              </h2>
              <p className="text-sm sm:text-base break-words">{about}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => reviewRequest("rejected", request._id)} className="btn btn-primary btn-sm sm:btn-md">Reject</button>
              <button onClick={() => reviewRequest("accepted", request._id)} className="btn btn-secondary btn-sm sm:btn-md">Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
