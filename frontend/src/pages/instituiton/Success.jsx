import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Confetti from "react-confetti";
import { FRONTEND_URL } from "../../helpers/url";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setIsActive } from "../../store/slice/instituteSlice";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionid) => {
      try {
        const resp = await axios.post(`${FRONTEND_URL}institution/checkout-success`, { sessionid });
        if (resp.status === 200) {
          toast.success("Checkout finalized successfully!");
          dispatch(setIsActive(true));
        } else {
          toast.error("Failed to finalize checkout");
        }
      } catch (error) {
        toast.error("Failed to finalize checkout: " + (error?.response?.data?.message || error.message));
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionid = new URLSearchParams(window.location.search).get("session_id");
    if (sessionid) {
      handleCheckoutSuccess(sessionid);
    } else {
      setError("No session ID found in the URL");
      setIsProcessing(false);
    }
  }, [dispatch]);

  if (isProcessing) 
    return (
      <div className="text-white text-center mt-20 px-4 sm:mt-32 sm:text-lg">
        Processing your order...
      </div>
    );

  if (error) 
    return (
      <div className="text-red-400 text-center mt-20 px-4 sm:mt-32 sm:text-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10
                      sm:max-w-lg sm:p-10 p-6">
        <div className="flex justify-center">
          <CheckCircle className="text-blue-400 w-16 h-16 mb-4 sm:w-20 sm:h-20" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-400 mb-2 px-2 sm:px-0">
          Subscription Successful!
        </h1>

        <p className="text-gray-300 text-center mb-6 px-2 sm:px-0">
          Thank you for your visit.
        </p>

        <div className="space-y-4">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4
            rounded-lg transition duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <HandHeart className="mr-2" size={18} />
            Thanks for trusting us!
          </button>

          <Link
            to="/login"
            className="w-full bg-gray-700 hover:bg-gray-600 text-blue-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            Login
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;