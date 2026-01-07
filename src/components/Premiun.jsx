import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremiumUser) {
        setIsUserPremium(true);
      }
    } catch (error) {
      console.error("Error verifying premium user:", error);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        memberShipType: type,
      },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Tinder",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    // This will open the Razorpay dialog box
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return isUserPremium ? (
    <div className="text-center mt-10 px-4 text-lg md:text-xl font-semibold">
      You're already a premium user
    </div>
  ) : (
    <div className="m-4 md:m-10 px-4">
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-0">
        <div className="card bg-base-300 rounded-box grid h-auto lg:h-80 flex-grow place-items-center p-6">
          <h1 className="font-bold text-2xl md:text-3xl mb-4">
            Silver Membership
          </h1>
          <ul className="text-sm md:text-base mb-4 space-y-2">
            <li> - Chat with other people</li>
            <li> - 100 connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 3 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("silver")}
            className="btn btn-secondary btn-sm md:btn-md"
          >
            Buy Silver
          </button>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-auto lg:h-80 flex-grow place-items-center p-6">
          <h1 className="font-bold text-2xl md:text-3xl mb-4">
            Gold Membership
          </h1>
          <ul className="text-sm md:text-base mb-4 space-y-2">
            <li> - Chat with other people</li>
            <li> - Infinite connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 6 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-primary btn-sm md:btn-md"
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};
export default Premium;
