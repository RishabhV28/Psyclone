import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Users, MessageCircle } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-psycho-100 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-psycho-800 mb-6">
                  Practice Your Psychology Skills with AI Patients
                </h1>
                <p className="text-lg text-psycho-700 mb-8">
                  Psyclone helps psychology students develop their therapeutic conversation 
                  skills through realistic simulated patient interactions.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/scenarios">
                    <Button size="lg" className="w-full sm:w-auto bg-psycho-500 hover:bg-psycho-600">
                      Start Practicing
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-psycho-500 text-psycho-500 hover:bg-psycho-100">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-6 -left-6 w-20 h-20 bg-psycho-200 rounded-full z-0"></div>
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-psycho-300 rounded-full z-0"></div>
                  <div className="relative z-10 bg-white rounded-lg shadow-xl p-6 border border-psycho-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-psycho-100 rounded-full p-2">
                          <Brain className="h-6 w-6 text-psycho-500" />
                        </div>
                        <span className="ml-2 font-medium text-gray-700">Virtual Patient</span>
                      </div>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800">I've been feeling anxious lately, especially in social situations. Sometimes I get these panic attacks where my heart races and I can't breathe properly...</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-psycho-500 text-white rounded-lg p-4 max-w-[80%]">
                        <p>That sounds difficult. Can you tell me more about when these panic attacks typically happen?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Psyclone Helps You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-psycho-100 p-3 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-psycho-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Realistic Scenarios</h3>
                <p className="text-gray-600">
                  Practice with AI patients presenting various psychological challenges based on real-world cases.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-psycho-100 p-3 rounded-full mb-4">
                  <Brain className="h-8 w-8 text-psycho-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Develop Clinical Skills</h3>
                <p className="text-gray-600">
                  Enhance your interviewing, diagnostic, and therapeutic conversation techniques in a low-risk environment.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center text-center">
                <div className="bg-psycho-100 p-3 rounded-full mb-4">
                  <Users className="h-8 w-8 text-psycho-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Learn at Your Own Pace</h3>
                <p className="text-gray-600">
                  Practice as much as you need, whenever you want, without the pressure of real-world consequences.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-psycho-500 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Improve Your Therapeutic Skills?</h2>
            <p className="text-xl text-psycho-100 mb-8 max-w-2xl mx-auto">
              Start practicing with our virtual patients and prepare yourself for real-world clinical interactions.
            </p>
            <Link to="/scenarios">
              <Button size="lg" variant="secondary" className="font-semibold">
                Browse Scenarios
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
