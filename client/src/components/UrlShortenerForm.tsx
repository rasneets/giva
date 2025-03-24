import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import UrlResult from "@/components/UrlResult";
import { Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

const urlFormSchema = z.object({
  longUrl: z.string()
    .url("Please enter a valid URL including http:// or https://"),
  customAlias: z.string()
    .optional()
    .refine(val => !val || (val.length >= 3 && val.length <= 20), {
      message: "Custom alias must be between 3 and 20 characters",
    })
    .refine(val => !val || /^[a-zA-Z0-9-_]+$/.test(val), {
      message: "Custom alias can only contain letters, numbers, hyphens, and underscores",
    })
});

type UrlFormData = z.infer<typeof urlFormSchema>;

interface ShortUrlResponse {
  shortUrl: string;
  shortCode: string;
  longUrl: string;
  createdAt: string;
  clicks: number;
}

export default function UrlShortenerForm() {
  const [shortUrlData, setShortUrlData] = useState<ShortUrlResponse | null>(null);
  const { toast } = useToast();
  
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      longUrl: "",
      customAlias: ""
    }
  });

  const shortenMutation = useMutation({
    mutationFn: async (data: UrlFormData) => {
      const response = await apiRequest("POST", "/api/shorten", data);
      return response.json() as Promise<ShortUrlResponse>;
    },
    onSuccess: (data) => {
      setShortUrlData(data);
      queryClient.invalidateQueries({ queryKey: ["/api/urls/recent"] });
      toast({
        title: "URL shortened successfully!",
        description: "Your URL has been shortened and is ready to use.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error shortening URL",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: UrlFormData) => {
    shortenMutation.mutate(data);
  };

  return (
    <>
      <Card className="bg-white rounded-lg shadow-lg mb-8">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your URL
              </Label>
              <Input
                {...form.register("longUrl")}
                id="longUrl"
                placeholder="https://example.com/your-long-url-to-shorten"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
              />
              {form.formState.errors.longUrl && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.longUrl.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter a valid URL including http:// or https://
              </p>
            </div>
            
            <div>
              <Label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Alias (Optional)
              </Label>
              <Input
                {...form.register("customAlias")}
                id="customAlias"
                placeholder="my-custom-name"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
              />
              {form.formState.errors.customAlias && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.customAlias.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for randomly generated short URL
              </p>
            </div>
            
            <div>
              <Button
                type="submit"
                disabled={shortenMutation.isPending}
                className="relative w-full bg-gradient-to-r from-[#D4AF37] via-[#F5E7A3] to-[#D4AF37] text-[#1A1A1A] font-bold py-3 px-6 rounded-md hover:shadow-lg transition-all duration-300"
                style={{ boxShadow: "0 4px 14px 0 rgba(212, 175, 55, 0.39)" }}
              >
                {shortenMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Shorten URL"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {shortUrlData && <UrlResult data={shortUrlData} />}
    </>
  );
}
