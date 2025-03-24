import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ShortUrlData {
  id: number;
  shortCode: string;
  longUrl: string;
  createdAt: string;
  clicks: number;
}

export default function RecentUrls() {
  const { data: recentUrls, isLoading } = useQuery<ShortUrlData[]>({
    queryKey: ["/api/urls/recent"],
  });

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-[#D4AF37] mb-4">
        Recent Gem Links
      </h3>
      <Card className="bg-[#2A2A2A] rounded-lg shadow-lg overflow-hidden border border-[#D4AF37]/30">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-6 w-1/3 bg-[#3A3A3A]" />
                <Skeleton className="h-6 w-1/2 hidden md:block bg-[#3A3A3A]" />
                <Skeleton className="h-6 w-12 bg-[#3A3A3A]" />
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-[#D4AF37]/20">
            <thead className="bg-[#1A1A1A]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                  Gem Link
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider hidden md:table-cell">
                  Original URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                  Brilliance
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#2A2A2A] divide-y divide-[#D4AF37]/20">
              {recentUrls && recentUrls.length > 0 ? (
                recentUrls.map((url) => (
                  <tr key={url.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/${url.shortCode}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#F5E7A3] hover:text-[#D4AF37] hover:underline transition-colors"
                      >
                        {window.location.origin}/{url.shortCode}
                      </a>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-[#F5E7A3]/70 truncate max-w-xs">
                        {url.longUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-[#D4AF37]/20 to-[#F5E7A3]/20 text-[#D4AF37]">
                        {url.clicks}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-[#F5E7A3]/70">
                    No gem links have been crafted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
