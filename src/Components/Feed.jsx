import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);


  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []); // ✅ fix infinite calls

  if (!feed) return;

  if (feed.length <= 0)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-gray-800 dark:bg-gray-700 bg-opacity-70 p-10 rounded-2xl shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-400 mb-4">
            No more users!
          </h1>
          <p className="text-gray-300">
            Looks like you've reached the end of the feed. Check back later for more developers to connect with.
          </p>
        </div>
      </div>

    );

  return (
    feed && (
      <div className="flex flex-col items-center gap-4 my-5">
        {feed && <UserCard user={feed[0]} />}
      </div>
    )
  );
};

export default Feed;
