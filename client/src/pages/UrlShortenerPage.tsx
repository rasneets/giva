import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import RecentUrls from "@/components/RecentUrls";

export default function UrlShortenerPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen font-['Montserrat']" style={{
      background: "linear-gradient(135deg, #F9F5EB 0%, #F0EBE3 100%)"
    }}>
      <nav className="bg-[#1A1A1A] text-[#F9F5EB] py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-['Playfair_Display'] text-[#3366FF] text-2xl font-bold">URL Shortener</span>
          </div>
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-[#F9F5EB] hover:text-[#3366FF] transition-colors"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-[#1A1A1A] mb-4">
            Transform Your Links
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create simple, shortened URLs perfect for sharing in presentations, social media, or reports.
          </p>
        </div>

        <UrlShortenerForm />
        <RecentUrls />
      </main>
    </div>
  );
}
