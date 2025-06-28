import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, MessageCircle, User } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Psyclone</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-psycho-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Psyclone was developed to provide psychology students and mental health professionals
            with a safe, accessible platform to practice their therapeutic conversation skills.
            We believe that the best way to learn is through practice, and our AI-powered
            simulations allow users to gain confidence before working with real patients.
          </p>
          <p className="text-gray-700">
            Our goal is to supplement traditional education with practical experiences that can be
            accessed anytime, anywhere, allowing students to practice at their own pace.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-psycho-700 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-psycho-50 p-6 rounded-lg border border-psycho-100">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 border border-psycho-100">
                <User className="h-6 w-6 text-psycho-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Choose a Scenario</h3>
              <p className="text-gray-600">
                Browse our library of realistic patient scenarios covering various psychological conditions.
              </p>
            </div>
            
            <div className="bg-psycho-50 p-6 rounded-lg border border-psycho-100">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 border border-psycho-100">
                <MessageCircle className="h-6 w-6 text-psycho-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Chat with Patients</h3>
              <p className="text-gray-600">
                Engage in realistic conversations with AI patients who respond in ways similar to real individuals.
              </p>
            </div>
            
            <div className="bg-psycho-50 p-6 rounded-lg border border-psycho-100">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 border border-psycho-100">
                <Brain className="h-6 w-6 text-psycho-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Develop Skills</h3>
              <p className="text-gray-600">
                Practice active listening, empathy, and appropriate therapeutic responses in a low-risk environment.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700">
            Our AI simulations are designed by experienced clinical psychologists and mental health professionals
            to ensure the responses are realistic and educationally valuable. While no simulation can fully replace
            real human interaction, PsychoChat provides valuable practice opportunities that complement traditional training.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-psycho-700 mb-4">Educational Philosophy</h2>
          <p className="text-gray-700 mb-4">
            PsychoChat is built on the principles of experiential learning and deliberate practice.
            We believe that developing clinical skills requires regular practice in realistic scenarios,
            with opportunities to try different approaches and learn from each interaction.
          </p>
          <p className="text-gray-700">
            Our platform is designed to complement formal education, not replace it. The simulations
            provide a bridge between theoretical knowledge and practical application, allowing students
            to gain confidence before working with real patients.
          </p>
        </section>
        
        <section className="mb-12">
          <div className="bg-psycho-100 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-psycho-700 mb-4">Ready to Practice?</h2>
            <p className="text-gray-700 mb-6">
              Start improving your therapeutic conversation skills today with our diverse range of scenarios.
            </p>
            <Link to="/scenarios">
              <Button size="lg" className="bg-psycho-500 hover:bg-psycho-600">
                Explore Scenarios
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
