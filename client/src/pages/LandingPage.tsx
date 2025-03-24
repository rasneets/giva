import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import ThreeJSBackground from "@/components/ThreeJSBackground";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleViewSubmission = useCallback(() => {
    navigate("/shorten");
  }, [navigate]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden" style={{
      background: "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
    }}>
      <div ref={containerRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-80">
        {mounted && <ThreeJSBackground containerRef={containerRef} />}
      </div>
      
      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-bold mb-12 font-['Playfair_Display']" 
          style={{ 
            color: "#D4AF37", 
            textShadow: "0 2px 4px rgba(212, 175, 55, 0.5)"
          }}
        >
          Hello Giva Team
        </h1>
        
        <div className="inline-block relative overflow-hidden">
          <Button 
            onClick={handleViewSubmission}
            className="text-lg md:text-xl font-bold py-4 px-8 rounded-md hover:shadow-lg hover:scale-105 transition-all duration-300 transform bg-gradient-to-r from-[#D4AF37] via-[#F5E7A3] to-[#D4AF37] text-[#1A1A1A]"
            style={{
              boxShadow: "0 4px 14px 0 rgba(212, 175, 55, 0.39)"
            }}
          >
            View Anirudh submission
          </Button>
        </div>
      </div>
    </section>
  );
}
