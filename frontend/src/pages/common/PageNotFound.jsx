
import { Ghost } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex flex-col items-center justify-center px-6 text-center">
      <Ghost size={80} className="text-indigo-600 animate-pulse mb-4" />
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Oops! The page you're looking for doesn't exist.
      </h2>
      <p className="text-gray-600 max-w-xl mb-6">
        It seems you've wandered into the void. Check the URL or go back to safety. If the problem persists, our support team is ready to help.
      </p>
      <p className="text-sm text-gray-400 mt-6">Need help? <a href="mailto:support@educonnect.com" className="underline text-indigo-600">Contact Support</a></p>
    </div>
  );
};

export default NotFound;