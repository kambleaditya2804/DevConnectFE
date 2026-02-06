import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection, removeConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      dispatch(removeConnection());
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0) return <div>No connections found</div>;

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl text-pink-400">
        Connections ({connections.length})
      </h1>

      {connections.map(({ _id, firstName, lastName, photoURL, age, gender, about }) => (
        <div key={_id} className="flex items-center m-2 p-2 rounded-lg bg-base-300 w-1/2 mx-auto">
          <img src={photoURL} alt="photo" className="w-14 h-14 rounded-full" />

          <div className="text-left m-4 p-4">
            <h2 className="font-bold text-xl">
              {firstName} {lastName}
            </h2>
            {age && gender && <p>{age} {gender}</p>}
            <p>{about}</p>
          </div>

          <Link to={`/chat/${_id}`}>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">
              Chat
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Connections;
