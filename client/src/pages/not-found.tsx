import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]">
      <Card className="w-full max-w-md mx-4 bg-[#2A2A2A] border border-[#D4AF37]/30">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-[#F5E7A3]">404 Gem Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-[#F5E7A3]/70">
            This treasure you seek seems to be missing from our collection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
