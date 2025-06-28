
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, MenuIcon, X } from "lucide-react";
import { useUserProgress } from "@/context/UserProgressContext";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { skillRating, userLevel } = useUserProgress();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Helper to determine if a path is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-psycho-500" />
              <Link to="/" className="ml-2 text-xl font-bold text-psycho-700">
                Psyclone
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              <Link
                to="/scenarios"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/scenarios") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
                }`}
              >
                Scenarios
              </Link>
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/dashboard") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/about") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
                }`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="mr-4 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">
              {userLevel.title}: {skillRating}
            </div>
            <Button variant="default" className="bg-psycho-500 hover:bg-psycho-600">
              Sign In
            </Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu} className="p-2">
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-white z-10 absolute w-full shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/scenarios"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/scenarios") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Scenarios
            </Link>
            <Link
              to="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/dashboard") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/about") ? "border-psycho-500 text-gray-900" : "border-transparent text-gray-500 hover:border-psycho-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="mt-4 px-3">
              <div className="mb-3 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 inline-block">
                {userLevel.title}: {skillRating}
              </div>
              <Button variant="default" className="w-full bg-psycho-500 hover:bg-psycho-600">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
