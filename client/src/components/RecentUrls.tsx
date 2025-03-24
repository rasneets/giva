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
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
        Recent URLs
      </h3>
      <Card className="bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/2 hidden md:block" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Original URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUrls && recentUrls.length > 0 ? (
                recentUrls.map((url) => (
                  <tr key={url.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/${url.shortCode}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#3366FF] hover:underline"
                      >
                        {window.location.origin}/{url.shortCode}
                      </a>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {url.longUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#3366FF] bg-opacity-10 text-[#3366FF]">
                        {url.clicks}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No URLs have been shortened yet
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
