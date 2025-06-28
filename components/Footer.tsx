import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Brain className="h-6 w-6 text-psycho-500" />
            <span className="ml-2 text-lg font-medium text-gray-900">Psyclone</span>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 md:mb-0">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 md:mb-0">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Contact Us
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Psyclone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
