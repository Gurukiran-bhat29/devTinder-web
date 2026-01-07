import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, photoUrl, about } = user;
  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        }
      );
      // handle response
      if (res.status === 200) {
        // Refresh the requests list
        dispatch(removeUserFromFeed(userId));
      }
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };

  return (
    <div className="card card-compact bg-base-100 sm:w-60 md:w-64 lg:w-64 shadow-xl">
      <figure>
        <img src={photoUrl} alt="User" className="w-full h-40 sm:h-48 md:h-52 object-cover" />
      </figure>
      <div className="card-body p-3">
        <h2 className="card-title text-sm sm:text-base">{`${firstName} ${lastName}`}</h2>
        <p className="text-xs break-words line-clamp-2">{about}</p>
        <div className="card-actions justify-center mt-2 gap-2">
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            className="btn btn-primary btn-sm sm:btn-md flex-1 sm:flex-none"
          >
            Ignore
          </button>
          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="btn btn-secondary btn-sm sm:btn-md flex-1 sm:flex-none"
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
