import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clipboard } from "lucide-react";

interface ShortUrlData {
  shortUrl: string;
  shortCode: string;
  longUrl: string;
  createdAt: string;
  clicks: number;
}

interface UrlResultProps {
  data: ShortUrlData;
}

export default function UrlResult({ data }: UrlResultProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(data.shortUrl)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Gem URL copied to clipboard!",
          description: "Your crafted link is ready to shine.",
          duration: 2000,
        });
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast({
          title: "Failed to copy URL",
          description: "Please try copying manually",
          variant: "destructive"
        });
      });
  };
  
  // Format date in a readable way
  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="bg-[#2A2A2A] rounded-lg shadow-lg mb-8 border border-[#D4AF37]/30">
      <CardContent className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
          Your Crafted Gem URL
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              value={data.shortUrl}
              readOnly
              className="w-full px-4 py-3 bg-[#1A1A1A] rounded-md border border-[#D4AF37]/50 text-[#F5E7A3] focus:outline-none"
            />
          </div>
          <Button
            onClick={handleCopy}
            className="bg-gradient-to-r from-[#D4AF37] via-[#F5E7A3] to-[#D4AF37] text-[#1A1A1A] font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ boxShadow: "0 2px 8px 0 rgba(212, 175, 55, 0.39)" }}
          >
            <Clipboard className="w-5 h-5" />
            {isCopied ? "Copied!" : "Copy Gem"}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between text-sm text-[#F5E7A3]/70">
          <div>Created: <span>{formattedDate}</span></div>
          <div>Clicks: <span>{data.clicks}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
