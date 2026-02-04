import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/premium/verify",
        { withCredentials: true }
      );

      if (res.data.isPremium) {
        setIsPremiumUser(true);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleBuy = async (type) => {
    try {
      const res = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevConnect Pvt Ltd",
        description: "Connect with developers around the world",
        order_id: orderId,
        callback_url: "http://localhost:3000/payment-success",
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        handler: function () {
          // after successful payment
          verifyPremiumUser();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Conditional rendering
  if (isPremiumUser) {
    return (
      <div className="w-full flex justify-center py-20">
        <h1 className="text-3xl font-bold text-green-500">
          Your Premium Membership is Active 🎉
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-10">
      <div className="flex flex-col lg:flex-row items-center gap-6 w-11/12 lg:w-3/4">

        {/* Silver Card */}
        <div className="card bg-base-300 rounded-box flex-1 p-6 text-center">
          <h2 className="font-bold text-3xl text-white mb-4">
            Silver Membership
          </h2>

          <ul className="space-y-2 mb-6">
            <li>Chat with other people</li>
            <li>1000 connection requests per day</li>
            <li>Blue tick</li>
            <li>3 months</li>
          </ul>

          <button
            onClick={() => handleBuy("silver")}
            className="btn btn-primary w-full"
          >
            Buy Now
          </button>
        </div>

        <div className="divider lg:divider-horizontal">OR</div>

        {/* Gold Card */}
        <div className="card bg-base-300 rounded-box flex-1 p-6 text-center">
          <h2 className="font-bold text-3xl text-yellow-500 mb-4">
            Gold Membership
          </h2>

          <ul className="space-y-2 mb-6">
            <li>Chat with other people</li>
            <li>Infinite connection requests per day</li>
            <li>Blue tick</li>
            <li>6 months</li>
          </ul>

          <button
            onClick={() => handleBuy("gold")}
            className="btn btn-primary w-full"
          >
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default Premium;
