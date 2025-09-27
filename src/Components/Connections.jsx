import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection, removeConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);

  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      dispatch(removeConnection());
      const connections = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(connections.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <div className="flex justify-center items-center h-[50vh]">
  <div className="bg-gray-800 dark:bg-gray-700 bg-opacity-70 p-8 rounded-2xl shadow-lg text-center max-w-md">
    <h1 className="text-2xl font-bold text-red-400 mb-2">
      No connections found
    </h1>
    <p className="text-gray-300">
      Looks like you don’t have any connections yet. Start exploring and connect with developers!
    </p>
  </div>
</div>

    );

  return (
    <div className=" text-center my-10">
      <h1 className="font-bold text-3xl text-pink-400">
        Connections ({connections.length})
      </h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, photoURL, age, gender, about } =
          connection;

        return (
          <div
            key={_id}
            className="flex items-center m-2 p-2  rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-14 h-14 rounded-full object-contain"
                src={photoURL}
              />
            </div>
            <div className="text-left m-4 p-4 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + " " + gender}</p>}
              <p>{about}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
