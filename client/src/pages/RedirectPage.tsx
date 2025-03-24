import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface RedirectPageProps {
  params: {
    shortCode: string;
  };
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const { shortCode } = params;
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const response = await apiRequest("GET", `/api/redirect/${shortCode}`, undefined);
        const data = await response.json();
        
        if (data.longUrl) {
          // Redirect to the original URL
          window.location.href = data.longUrl;
        } else {
          setError("URL not found");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (err) {
        setError("Error retrieving URL");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    fetchOriginalUrl();
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] p-4">
      {error ? (
        <div className="text-center bg-[#2A2A2A] p-8 rounded-lg shadow-lg border border-[#D4AF37]/30">
          <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">{error}</h1>
          <p className="mb-4 text-[#F5E7A3]/70">Returning to collection page in a few seconds...</p>
        </div>
      ) : (
        <div className="text-center bg-[#2A2A2A] p-8 rounded-lg shadow-lg border border-[#D4AF37]/30">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-[#D4AF37]" />
          <h1 className="text-2xl font-bold mb-4 text-[#F5E7A3]">Polishing Your Gem...</h1>
          <p className="text-[#F5E7A3]/70">You are being redirected to the original destination.</p>
        </div>
      )}
    </div>
  );
}
