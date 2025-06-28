
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Brain className="h-24 w-24 text-psycho-300" />
            <div className="absolute top-0 right-0 bg-psycho-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ?
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404: Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-psycho-500 hover:bg-psycho-600">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
